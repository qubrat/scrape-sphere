'use server';

import { TimePeriodToDateRange } from '@/lib/helper/dates';
import prisma from '@/lib/prisma';
import { TimePeriod } from '@/types/analytics';
import { WorkflowExecutionStatus } from '@/types/workflow';
import { auth } from '@clerk/nextjs/server';

const { COMPLETED, FAILED } = WorkflowExecutionStatus;

export async function getStatsCardsValues(selectedTimePeriod: TimePeriod) {
	const { userId } = await auth();
	if (!userId) {
		throw new Error('User not authenticated');
	}
	const dateRange = TimePeriodToDateRange(selectedTimePeriod);
	const executions = await prisma.workflowExecution.findMany({
		where: {
			userId,
			startedAt: {
				gte: dateRange.startDate,
				lte: dateRange.endDate
			},
			status: {
				in: [COMPLETED, FAILED]
			}
		},
		select: {
			creditsConsumed: true,
			phases: {
				where: {
					creditsConsumed: {
						not: null
					}
				},
				select: {
					creditsConsumed: true
				}
			}
		}
	});

	const stats = {
		workflowExecutions: executions.length,
		creditsConsumed: 0,
		phaseExecutions: 0
	};

	stats.creditsConsumed = executions.reduce((total, execution) => total + execution.creditsConsumed, 0);
	stats.phaseExecutions = executions.reduce((total, execution) => total + execution.phases.length, 0);

	return stats;
}
