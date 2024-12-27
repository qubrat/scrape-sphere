import { getWorkflowExecutionStats } from '@/actions/analytics/getWorkflowExecutionStats';
import { TimePeriod } from '@/types/analytics';
import React from 'react';
import ExecutionStatusChart from './ExecutionStatusChart';
import { getCreditsUsageInTimePeriod } from '@/actions/analytics/getCreditsUsageInTimePeriod';
import CreditUsageChart from '../../billing/_components/CreditUsageChart';

type ChartCardProps = {
	selectedTimePeriod: TimePeriod;
};

const StatsExecutionStatus = async ({ selectedTimePeriod }: ChartCardProps) => {
	const data = await getWorkflowExecutionStats(selectedTimePeriod);
	return <ExecutionStatusChart data={data} />;
};

const CreditsUsageInTimePeriod = async ({ selectedTimePeriod }: ChartCardProps) => {
	const data = await getCreditsUsageInTimePeriod(selectedTimePeriod);
	return <CreditUsageChart data={data} title="Daily credits usage" description="Credits consumed in selected time period" />;
};

export { StatsExecutionStatus, CreditsUsageInTimePeriod };
