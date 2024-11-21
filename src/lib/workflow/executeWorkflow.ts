import 'server-only';
import prisma from '@/lib/prisma';
import { ExecutionPhase, ExecutionPhaseStatus, WorkflowExecution, WorkflowExecutionStatus } from '@/types/workflow';
import { waitFor } from '../helper/waitFor';
import triggerRevalidation from '../helper/revalidation';

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

	const environment = { phases: {} };

	await initializeWorkflowExecution(executionId, execution.workflowId);
	await initializePhaseStatuses(execution as WorkflowExecution);

	let creditsConsumed = 0;
	let executionFailed = false;

	for (const phase of execution.phases) {
		await waitFor(1000);
		// console.log(phase);
		// Execute phase
		// Consume credits
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
