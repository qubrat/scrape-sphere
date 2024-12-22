import React, { Suspense } from 'react';
import TimePeriodSelectorWrapper from './_components/TimePeriodSelectorWrapper';
import { TimePeriod } from '@/types/analytics';
import { Skeleton } from '@/components/ui/skeleton';
import StatsCards from './_components/StatsCards';
import StatsCardSkeleton from './_components/StatsCardSkeleton';

type HomePageProps = {
	searchParams: Promise<{ month?: string; year?: string }>;
};

const HomePage = async ({ searchParams }: HomePageProps) => {
	const currentDate = new Date();
	const { month, year } = await searchParams;
	const timePeriod: TimePeriod = {
		month: month ? parseInt(month) : currentDate.getMonth(),
		year: year ? parseInt(year) : currentDate.getFullYear()
	};

	return (
		<div className="flex flex-1 flex-col h-full">
			<div className="flex justify-between">
				<h1 className="text-3xl font-bold">Home</h1>
				<Suspense fallback={<Skeleton className="w-44 h-10" />}>
					<TimePeriodSelectorWrapper selectedTimePeriod={timePeriod} />
				</Suspense>
			</div>
			<div className="h-full py-6 flex flex-col gap-4">
				<Suspense fallback={<StatsCardSkeleton />}>
					<StatsCards selectedTimePeriod={timePeriod} />
				</Suspense>
			</div>
		</div>
	);
};

export default HomePage;
