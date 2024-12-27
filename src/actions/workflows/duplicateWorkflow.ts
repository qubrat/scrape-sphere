'use server';

import prisma from '@/lib/prisma';
import { duplicateWorkflowSchema, DuplicateWorkflowSchemaType } from '@/schema/workflow';
import { WorkflowStatus } from '@/types/workflow';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function duplicateWorkflow(form: DuplicateWorkflowSchemaType) {
	const { success, data } = duplicateWorkflowSchema.safeParse(form);
	if (!success) {
		throw new Error('Invalid form data');
	}

	const { userId } = await auth();
	if (!userId) {
		throw new Error('User not authenticated');
	}

	const sourceWorkflow = await prisma.workflow.findUnique({
		where: {
			id: data.workflowId,
			userId
		}
	});
	if (!sourceWorkflow) {
		throw new Error('Workflow not found');
	}

	const newWorkflow = await prisma.workflow.create({
		data: {
			userId,
			name: data.name,
			description: data.description,
			status: WorkflowStatus.DRAFT,
			definition: sourceWorkflow.definition
		}
	});
	if (!newWorkflow) {
		throw new Error('Failed to duplicate workflow');
	}
	revalidatePath('/workflows');
}
