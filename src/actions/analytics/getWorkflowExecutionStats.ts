import { TimePeriodToDateRange } from '@/lib/helper/dates';
import prisma from '@/lib/prisma';
import { TimePeriod } from '@/types/analytics';
import { WorkflowExecutionStatus } from '@/types/workflow';
import { auth } from '@clerk/nextjs/server';
import { eachDayOfInterval, format } from 'date-fns';

type Stats = Record<string, { success: number; failed: number }>;

export async function getWorkflowExecutionStats(timePeriod: TimePeriod) {
	const { userId } = await auth();
	if (!userId) {
		throw new Error('User not authenticated');
	}

	const dateRange = TimePeriodToDateRange(timePeriod);
	const executions = await prisma.workflowExecution.findMany({
		where: {
			userId,
			startedAt: {
				gte: dateRange.startDate,
				lte: dateRange.endDate
			}
		}
	});

	const dateFormat = 'yyyy-MM-dd';

	const stats: Stats = eachDayOfInterval({
		start: dateRange.startDate,
		end: dateRange.endDate
	})
		.map((date) => format(date, dateFormat))
		.reduce((acc, date) => {
			acc[date] = {
				success: 0,
				failed: 0
			};
			return acc;
		}, {} as any);

	executions.forEach((execution) => {
		const date = format(execution.startedAt!, dateFormat);
		if (execution.status === WorkflowExecutionStatus.COMPLETED) {
			stats[date].success++;
		} else if (execution.status === WorkflowExecutionStatus.FAILED) {
			stats[date].failed++;
		}
	});

	const result = Object.entries(stats).map(([date, infos]) => ({
		date,
		...infos
	}));

	return result;
}
