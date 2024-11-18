'use server';

import prisma from '@/lib/prisma';
import { flowToExecutionPlan } from '@/lib/workflow/executionPlan';
import { TaskRegistry } from '@/lib/workflow/task/Registry';
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowExecutionTrigger } from '@/types/workflow';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/dist/server/api-utils';

export async function runWorkflow(form: { workflowId: string; flowDefinition?: string }) {
	const { userId } = await auth();

	if (!userId) {
		throw new Error('User not authenticated');
	}

	const { workflowId, flowDefinition } = form;
	if (!workflowId) {
		throw new Error('Workflow ID is required');
	}

	const workflow = await prisma.workflow.findUnique({
		where: {
			id: workflowId,
			userId
		}
	});

	if (!workflow) {
		throw new Error('Workflow not found');
	}

	let executionPlan: WorkflowExecutionPlan;
	if (!flowDefinition) {
		throw new Error('Flow definition is not defined');
	}

	const flow = JSON.parse(flowDefinition);
	const result = flowToExecutionPlan(flow.nodes, flow.edges);
	if (result.error) {
		throw new Error('Invalid flow definition');
	}
	if (!result.executionPlan) {
		throw new Error('No execution plan generated');
	}

	executionPlan = result.executionPlan;

	const execution = await prisma.workflowExecution.create({
		data: {
			workflowId,
			userId,
			status: WorkflowExecutionStatus.PENDING,
			startedAt: new Date(),
			trigger: WorkflowExecutionTrigger.MANUAL,
			phases: {
				create: executionPlan.flatMap((phase) => {
					return phase.nodes.flatMap((node) => {
						return {
							userId,
							status: ExecutionPhaseStatus.CREATED,
							number: phase.phase,
							node: JSON.stringify(node),
							name: TaskRegistry[node.data.type].label
						};
					});
				})
			}
		},
		select: {
			id: true,
			phases: true
		}
	});

	if (!execution) {
		throw new Error('Failed to create workflow execution');
	}

	// redirect(`/workflows/runs/${workflowId}/${execution.id}`);
	return { success: true, executionId: execution.id };
}
