import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const StatsCardSkeleton = () => {
	return (
		<div className="grid gap-3 lg:gap-8 lg:grid-cols-3">
			{[1, 2, 3].map((i) => (
				<Skeleton key={i} className="min-h-32 w-full" />
			))}
		</div>
	);
};

export default StatsCardSkeleton;
