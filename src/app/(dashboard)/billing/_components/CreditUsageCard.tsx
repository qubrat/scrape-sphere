import { getCreditsUsageInTimePeriod } from '@/actions/analytics/getCreditsUsageInTimePeriod';
import { TimePeriod } from '@/types/analytics';
import React from 'react';
import CreditUsageChart from './CreditUsageChart';

const CreditUsageCard = async () => {
	const timePeriod: TimePeriod = {
		month: new Date().getMonth(),
		year: new Date().getFullYear()
	};

	const data = await getCreditsUsageInTimePeriod(timePeriod);

	return <CreditUsageChart data={data} title="Credits consumed" description="Daily credits consumed in the current month" />;
};

export default CreditUsageCard;
