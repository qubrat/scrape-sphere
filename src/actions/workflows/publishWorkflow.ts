'use server';

import prisma from '@/lib/prisma';
import { calculateWorkflowCost } from '@/lib/utils';
import { flowToExecutionPlan } from '@/lib/workflow/executionPlan/flowToExecutionPlan';
import { WorkflowStatus } from '@/types/workflow';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

type PublishWorkflowProps = {
	id: string;
	flowDefinition: string;
};

export async function publishWorkflow({ id, flowDefinition }: PublishWorkflowProps) {
	const { userId } = await auth();
	if (!userId) {
		throw new Error('Unauthorized');
	}

	const workflow = await prisma.workflow.findUnique({
		where: {
			id,
			userId
		}
	});

	if (!workflow) {
		throw new Error('Workflow not found');
	}

	if (workflow.status !== 'DRAFT') {
		throw new Error('Workflow is not a draft');
	}

	const flow = JSON.parse(flowDefinition);
	const result = flowToExecutionPlan(flow.nodes, flow.edges);
	if (result.error) {
		throw new Error('Flow definition is not valid');
	}
	if (!result.executionPlan) {
		throw new Error('No execution plan generated');
	}

	const creditsCost = calculateWorkflowCost(flow.nodes);
	await prisma.workflow.update({
		where: {
			id,
			userId
		},
		data: {
			status: WorkflowStatus.PUBLISHED,
			definition: flowDefinition,
			executionPlan: JSON.stringify(result.executionPlan),
			creditsCost
		}
	});
	revalidatePath(`/workflow/editor/${id}`);
}
