import { TimePeriod } from '@/types/analytics';
import { endOfMonth, intervalToDuration, startOfMonth } from 'date-fns';

export function datesToDurationString(end: Date | null | undefined, start: Date | null | undefined) {
	if (!end || !start) return null;

	const timeElapsed = end.getTime() - start.getTime();
	if (timeElapsed < 1000) {
		return `${timeElapsed}ms`;
	}

	const duration = intervalToDuration({ start: 0, end: timeElapsed });

	return `${duration.minutes || 0}min ${duration.seconds || 0}s`;
}

export function TimePeriodToDateRange(timePeriod: TimePeriod) {
	const startDate = startOfMonth(new Date(timePeriod.year, timePeriod.month));
	const endDate = endOfMonth(new Date(timePeriod.year, timePeriod.month));

	return { startDate, endDate };
}
