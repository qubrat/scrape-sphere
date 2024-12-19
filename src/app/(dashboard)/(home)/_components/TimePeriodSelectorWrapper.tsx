import { getTimePeriods } from '@/actions/analytics/getTimePeriods';
import React from 'react';
import TimePeriodSelector from './TimePeriodSelector';
import { TimePeriod } from '@/types/analytics';

type TimePeriodSelectorWrapperProps = {
	selectedTimePeriod: TimePeriod;
};

const TimePeriodSelectorWrapper = async ({ selectedTimePeriod }: TimePeriodSelectorWrapperProps) => {
	const timePeriods = await getTimePeriods();
	return <TimePeriodSelector timePeriods={timePeriods} selectedTimePeriod={selectedTimePeriod} />;
};

export default TimePeriodSelectorWrapper;
