'use server';

import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import parser from 'cron-parser';
import { revalidatePath } from 'next/cache';

type UpdateWorkflowCronProps = {
	id: string;
	cron: string;
};

export async function updateWorkflowCron({ id, cron }: UpdateWorkflowCronProps) {
	const { userId } = await auth();

	if (!userId) {
		throw new Error('User not authenticated');
	}

	try {
		const interval = parser.parseExpression(cron, { utc: true });
		await prisma.workflow.update({
			where: {
				id,
				userId
			},
			data: {
				cron,
				nextRunAt: interval.next().toDate()
			}
		});
	} catch (error: any) {
		console.error(error.message);
		throw new Error('Invalid cron expression');
	}

	revalidatePath('/workflows');
}
