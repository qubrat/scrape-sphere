import { getStatsCardsValues } from '@/actions/analytics/getStatsCardsValues';
import { TimePeriod } from '@/types/analytics';
import { CirclePlayIcon, CoinsIcon, SquareStackIcon } from 'lucide-react';
import StatsCard from './StatsCard';

type StatsCardsProps = {
	selectedTimePeriod: TimePeriod;
};

const StatsCards = async ({ selectedTimePeriod }: StatsCardsProps) => {
	const data = await getStatsCardsValues(selectedTimePeriod);

	return (
		<div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-32">
			<StatsCard title="Workflow executions" value={data.workflowExecutions} icon={CirclePlayIcon} />
			<StatsCard title="Phase executions" value={data.phaseExecutions} icon={SquareStackIcon} />
			<StatsCard title="Credits consumed" value={data.creditsConsumed} icon={CoinsIcon} />
		</div>
	);
};

export default StatsCards;
