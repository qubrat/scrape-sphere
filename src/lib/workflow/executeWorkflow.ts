import 'server-only';
import prisma from '@/lib/prisma';
import { ExecutionPhase, ExecutionPhaseStatus, WorkflowExecutionStatus } from '@/types/workflow';
import triggerRevalidation from '@/lib/helper/revalidation';
import { AppNode } from '@/types/appNode';
import { TaskRegistry } from '@/lib/workflow/task/Registry';
import { ExecutorRegistry } from '@/lib/workflow/executor/Registry';
import { Environment, ExecutionEnvironment } from '@/types/executor';
import { TaskParam } from '@/types/task';
import { Browser, Page } from 'puppeteer';
import { Edge } from '@xyflow/react';
import { LogCollector } from '@/types/log';
import { createLogCollector } from '@/lib/log';

export async function executeWorkflow(executionId: string) {
	const execution = await prisma.workflowExecution.findUnique({
		where: {
			id: executionId
		},
		include: {
			workflow: true,
			phases: true
		}
	});

	if (!execution) {
		throw new Error('Execution not found');
	}

	const edges = JSON.parse(execution.definition).edges as Edge[];
	const environment: Environment = { phases: {} };

	await initializeWorkflowExecution(executionId, execution.workflowId);
	await initializePhaseStatuses(execution.id, execution.phases as ExecutionPhase[]);

	let creditsConsumed = 0;
	let executionFailed = false;

	const phases = execution.phases as ExecutionPhase[];
	for (const phase of phases) {
		const phaseExecution = await executeWorkflowPhase(phase, environment, edges, execution.userId);
		creditsConsumed += phaseExecution.creditsConsumed || 0;
		if (!phaseExecution.success) {
			executionFailed = true;
			break;
		}
	}

	await finalizeExecution(executionId, execution.workflowId, executionFailed, creditsConsumed);
	await cleanupEnvironment(environment);
	triggerRevalidation('/workflow/runs');
}

async function initializeWorkflowExecution(executionId: string, workflowId: string) {
	await prisma.workflowExecution.update({
		where: {
			id: executionId
		},
		data: {
			startedAt: new Date(),
			status: WorkflowExecutionStatus.RUNNING
		}
	});

	await prisma.workflow.update({
		where: {
			id: workflowId
		},
		data: {
			lastRunAt: new Date(),
			lastRunStatus: WorkflowExecutionStatus.RUNNING,
			lastRunId: executionId
		}
	});
}

async function initializePhaseStatuses(executionId: string, phases: ExecutionPhase[]) {
	await prisma.executionPhase.updateMany({
		where: {
			id: { in: phases.map((phase) => phase.id) }
		},
		data: {
			status: ExecutionPhaseStatus.PENDING
		}
	});
}

async function finalizeExecution(executionId: string, workflowId: string, executionFailed: boolean, creditsConsumed: number) {
	const finalStatus = executionFailed ? WorkflowExecutionStatus.FAILED : WorkflowExecutionStatus.COMPLETED;
	await prisma.workflowExecution.update({
		where: {
			id: executionId
		},
		data: {
			completedAt: new Date(),
			status: finalStatus,
			creditsConsumed
		}
	});

	await prisma.workflow
		.update({
			where: {
				id: workflowId,
				lastRunId: executionId
			},
			data: {
				lastRunStatus: finalStatus
			}
		})
		.catch((err) => {
			// ignore
			// this means that we have triggered other runs for this workflow while this one was running
		});
}

async function executeWorkflowPhase(phase: ExecutionPhase, environment: Environment, edges: Edge[], userId: string) {
	const startedAt = new Date();
	const node = JSON.parse(phase.node) as AppNode;
	const logCollector = createLogCollector();
	setupEnvironmentForPhase(node, environment, edges);

	await prisma.executionPhase.update({
		where: {
			id: phase.id
		},
		data: {
			startedAt,
			status: ExecutionPhaseStatus.RUNNING,
			inputs: JSON.stringify(environment.phases[node.id].inputs)
		}
	});

	const creditsRequired = TaskRegistry[node.data.type].credits;

	let success = await decrementUserBalance(userId, creditsRequired, logCollector);
	const creditsConsumed = success ? creditsRequired : 0;

	if (success) {
		// We can execute the phase if we have enough credits
		success = await executePhase(phase, node, environment, logCollector);
	}

	const outputs = environment.phases[node.id].outputs;
	await finalizePhase(phase.id, success, outputs, logCollector, creditsConsumed);
	return { success, creditsConsumed };
}

async function finalizePhase(
	phaseId: string,
	success: boolean,
	outputs: Record<string, string>,
	logCollector: LogCollector,
	creditsConsumed: number
) {
	const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED;

	await prisma.executionPhase.update({
		where: {
			id: phaseId
		},
		data: {
			completedAt: new Date(),
			status: finalStatus,
			outputs: JSON.stringify(outputs),
			creditsConsumed,
			logs: {
				createMany: {
					data: logCollector.getAll().map((log) => ({ logLevel: log.level, message: log.message, timestamp: log.timestamp }))
				}
			}
		}
	});
}

async function executePhase(phase: ExecutionPhase, node: AppNode, environment: Environment, logCollector: LogCollector): Promise<boolean> {
	const runFunction = ExecutorRegistry[node.data.type];

	if (!runFunction) {
		return false;
	}

	const executionEnvironment: ExecutionEnvironment<any> = createExecutionEnvironment(node, environment, logCollector);

	return await runFunction(executionEnvironment);
}

function setupEnvironmentForPhase(node: AppNode, environment: Environment, edges: Edge[]) {
	environment.phases[node.id] = { inputs: {}, outputs: {} };
	const inputs = TaskRegistry[node.data.type].inputs;
	for (const input of inputs) {
		if (input.type === TaskParam.BROWSER_INSTANCE) continue;
		const inputValue = node.data.inputs[input.name];
		if (inputValue) {
			environment.phases[node.id].inputs[input.name] = inputValue;
			continue;
		}

		const connectedEdge = edges.find((edge) => edge.target === node.id && edge.targetHandle === input.name);
		if (!connectedEdge) {
			console.error(`Input ${input.name} not found for node ${node.id}`);
			continue;
		}

		const outputValue = environment.phases[connectedEdge.source].outputs[connectedEdge.sourceHandle!];
		environment.phases[node.id].inputs[input.name] = outputValue;
	}
}

function createExecutionEnvironment(node: AppNode, environment: Environment, logCollector: LogCollector): ExecutionEnvironment<any> {
	return {
		getInput: (name: string) => environment.phases[node.id].inputs[name],
		setOutput: (name: string, value: string) => (environment.phases[node.id].outputs[name] = value),

		getBrowser: () => environment.browser,
		setBrowser: (browser: Browser) => (environment.browser = browser),

		getPage: () => environment.page,
		setPage: (page: Page) => (environment.page = page),

		log: logCollector
	};
}

async function cleanupEnvironment(environment: Environment) {
	if (environment.browser) {
		await environment.browser.close().catch((err) => console.error('Cannot close browser. Reason:', err));
	}
}

async function decrementUserBalance(userId: string, amount: number, logCollector: LogCollector) {
	try {
		await prisma.userBalance.update({
			where: {
				userId,
				credits: {
					gte: amount
				}
			},
			data: {
				credits: {
					decrement: amount
				}
			}
		});
		return true;
	} catch (err) {
		logCollector.error('Insufficient balance');
		return false;
	}
}
