import 'server-only';
import prisma from '@/lib/prisma';
import { ExecutionPhase, ExecutionPhaseStatus, WorkflowExecution, WorkflowExecutionStatus } from '@/types/workflow';
import triggerRevalidation from '@/lib/helper/revalidation';
import { AppNode } from '@/types/appNode';
import { TaskRegistry } from '@/lib/workflow/task/Registry';
import { ExecutorRegistry } from '@/lib/workflow/executor/Registry';
import { Environment, ExecutionEnvironment } from '@/types/executor';

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

	const environment: Environment = { phases: {} };

	await initializeWorkflowExecution(executionId, execution.workflowId);
	await initializePhaseStatuses(execution as WorkflowExecution);

	let creditsConsumed = 0;
	let executionFailed = false;

	const phases = execution.phases as ExecutionPhase[];
	for (const phase of phases) {
		const phaseExecution = await executeWorkflowPhase(phase, environment);
		if (!phaseExecution.success) {
			executionFailed = true;
			break;
		}
		// TODO: Execute phase
		// TODO: Consume credits
	}

	await finalizeExecution(executionId, execution.workflowId, executionFailed, creditsConsumed);
	// Cleanup execution environment
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

async function initializePhaseStatuses(execution: WorkflowExecution) {
	await prisma.executionPhase.updateMany({
		where: {
			id: { in: execution.phases.map((phase: ExecutionPhase) => phase.id) }
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

async function executeWorkflowPhase(phase: ExecutionPhase, environment: Environment) {
	const startedAt = new Date();
	const node = JSON.parse(phase.node) as AppNode;
	setupEnvironmentForPhase(node, environment);

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
	console.log(`Executing phase ${phase.name} with ${creditsRequired} credits required`);

	// TODO: decrement user balance with required credits

	const success = await executePhase(phase, node, environment);

	await finalizePhase(phase.id, success);
	return { success };
}

async function finalizePhase(phaseId: string, success: boolean) {
	const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED;

	await prisma.executionPhase.update({
		where: {
			id: phaseId
		},
		data: {
			completedAt: new Date(),
			status: finalStatus
		}
	});
}

async function executePhase(phase: ExecutionPhase, node: AppNode, environment: Environment): Promise<boolean> {
	const runFunction = ExecutorRegistry[node.data.type];

	if (!runFunction) {
		return false;
	}

	const executionEnvironment: ExecutionEnvironment<any> = createExecutionEnvironment(node, environment);

	return await runFunction(executionEnvironment);
}

function setupEnvironmentForPhase(node: AppNode, environment: Environment) {
	environment.phases[node.id] = { inputs: {}, outputs: {} };
	const inputs = TaskRegistry[node.data.type].inputs;
	for (const input of inputs) {
		const inputValue = node.data.inputs[input.name];
		if (inputValue) {
			environment.phases[node.id].inputs[input.name] = inputValue;
			continue;
		}
	}
}

function createExecutionEnvironment(node: AppNode, environment: Environment) {
	return {
		getInput: (name: string) => environment.phases[node.id].inputs[name]
	};
}
