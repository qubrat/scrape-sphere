'use server';

import prisma from '@/lib/prisma';
import { TimePeriod } from '@/types/analytics';
import { auth } from '@clerk/nextjs/server';

export async function getTimePeriods() {
	const { userId } = await auth();
	if (!userId) {
		throw new Error('User not authenticated');
	}

	const years = await prisma.workflowExecution.aggregate({
		where: {
			userId
		},
		_min: { startedAt: true }
	});

	const currentYear = new Date().getFullYear();
	const minYear = years._min.startedAt ? years._min.startedAt.getFullYear() : currentYear;

	const timePeriods: TimePeriod[] = [];
	for (let year = minYear; year <= currentYear; year++) {
		for (let month = 0; month <= 11; month++) {
			timePeriods.push({ year, month });
		}
	}
	return timePeriods;
}
