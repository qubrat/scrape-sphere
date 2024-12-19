'use client';
import { MONTH_NAMES, TimePeriod } from '@/types/analytics';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSearchParams } from 'next/navigation';

type TimePeriodSelectorProps = {
	timePeriods: TimePeriod[];
	selectedTimePeriod: TimePeriod;
};

function TimePeriodSelector({ timePeriods, selectedTimePeriod }: TimePeriodSelectorProps) {
	const searchParams = useSearchParams();
	return (
		<Select
			onValueChange={(value) => {
				const [month, year] = value.split('-');
				const params = new URLSearchParams(searchParams);
				params.set('month', month);
				params.set('year', year);
				history.pushState(null, '', `?${params.toString()}`);
			}}
			defaultValue={`${selectedTimePeriod.month}-${selectedTimePeriod.year}`}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select a time period" />
			</SelectTrigger>
			<SelectContent>
				{timePeriods.map((timePeriod, index) => (
					<SelectItem key={index} value={`${timePeriod.month}-${timePeriod.year}`}>{`${MONTH_NAMES[timePeriod.month]} ${
						timePeriod.year
					}`}</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

export default TimePeriodSelector;
