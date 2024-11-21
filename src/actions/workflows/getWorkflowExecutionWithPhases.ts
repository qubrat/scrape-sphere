'use server';

import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function getWorkflowExecutionWithPhases(executionId: string) {
	const { userId } = await auth();

	if (!userId) {
		throw new Error('Unauthenticated');
	}

	const workflowExecution = await prisma.workflowExecution.findUnique({
		where: {
			id: executionId,
			userId
		},
		include: {
			phases: {
				orderBy: {
					number: 'asc'
				}
			}
		}
	});

	return workflowExecution;
}