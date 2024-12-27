import React, { Suspense } from 'react';
import BalanceCard from './_components/BalanceCard';
import { Skeleton } from '@/components/ui/skeleton';
import CreditsPurchase from './_components/CreditsPurchase';
import CreditUsageCard from './_components/CreditUsageCard';
import TransactionHistoryCard from './_components/TransactionHistoryCard';

const BillingPage = () => {
	return (
		<div className="mx-auto p-4 space-y-8">
			<h1 className="text-3xl font-bold">Billing</h1>
			<Suspense fallback={<Skeleton className="h-40 w-full" />}>
				<BalanceCard />
			</Suspense>
			<CreditsPurchase />
			<Suspense fallback={<Skeleton className="h-72 w-full" />}>
				<CreditUsageCard />
			</Suspense>
			<Suspense fallback={<Skeleton className="h-72 w-full" />}>
				<TransactionHistoryCard />
			</Suspense>
		</div>
	);
};

export default BillingPage;
