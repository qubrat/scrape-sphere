import { getWorkflowExecutionStats } from '@/actions/analytics/getWorkflowExecutionStats';
import { TimePeriod } from '@/types/analytics';
import React from 'react';
import ExecutionStatusChart from './ExecutionStatusChart';
import { getCreditsUsageInTimePeriod } from '@/actions/analytics/getCreditsUsageInTimePeriod';

type ChartCardProps = {
	selectedTimePeriod: TimePeriod;
};

const StatsExecutionStatus = async ({ selectedTimePeriod }: ChartCardProps) => {
	const data = await getWorkflowExecutionStats(selectedTimePeriod);
	return <ExecutionStatusChart data={data} />;
};

const CreditsUsageInTimePeriod = async ({ selectedTimePeriod }: ChartCardProps) => {
	const data = await getCreditsUsageInTimePeriod(selectedTimePeriod);
	return <ExecutionStatusChart data={data} />;
};

export { StatsExecutionStatus, CreditsUsageInTimePeriod };
