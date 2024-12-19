import { getStatsCardsValues } from '@/actions/analytics/getStatsCardsValues';
import { TimePeriod } from '@/types/analytics';
import React from 'react';

type StatsCardsProps = {
	selectedTimePeriod: TimePeriod;
};

const StatsCards = async ({ selectedTimePeriod }: StatsCardsProps) => {
	const data = await getStatsCardsValues(selectedTimePeriod);

	return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default StatsCards;
