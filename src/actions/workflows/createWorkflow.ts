'use server';

import prisma from '@/lib/prisma';
import { createWorkflowSchema, type CreateWorkflowSchemaType } from '@/schema/workflow';
import { WorkflowStatus } from '@/types/workflow';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { AppNode } from '@/types/appNode';
import { Edge } from '@xyflow/react';
import { createFlowNode } from '@/lib/workflow/createFlowNode';
import { Task } from '@/types/task';

export async function createWorkflow(form: CreateWorkflowSchemaType) {
	const { success, data } = createWorkflowSchema.safeParse(form);

	if (!success) {
		throw new Error('Invalid form data');
	}

	const { userId } = await auth();

	if (!userId) {
		throw new Error('User not authenticated');
	}

	const initialWorkflow: { nodes: AppNode[]; edges: Edge[] } = {
		nodes: [],
		edges: []
	};

	initialWorkflow.nodes.push(createFlowNode(Task.LAUNCH_BROWSER));

	const result = await prisma.workflow.create({
		data: {
			userId: userId,
			status: WorkflowStatus.DRAFT,
			definition: JSON.stringify(initialWorkflow),
			...data
		}
	});

	if (!result) {
		throw new Error('Failed to create workflow');
	}
	revalidatePath('/workflows');

	return { success: true, workflowId: result.id };
}
