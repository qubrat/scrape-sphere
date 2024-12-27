'use client';
import { getAvailableCredits } from '@/actions/billing/getAvailableCredits';
import { useQuery } from '@tanstack/react-query';
import { CoinsIcon, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import DisplayIf from './DisplayIf';
import ReactCountUpWrapper from './ReactCountUpWrapper';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';

const UserAvailableCreditsBadge = () => {
	const query = useQuery({
		queryKey: ['user-available-credits'],
		queryFn: () => getAvailableCredits(),
		refetchInterval: 30 * 1000
	});

	return (
		<Link href="/billing" className={cn('w-full space-x-2 items-center', buttonVariants({ variant: 'outline', size: 'sm' }))}>
			<CoinsIcon size={20} className="text-primary" />
			<span className="font semibold capitalize">
				<DisplayIf condition={query.isLoading}>
					<Loader2Icon size={20} className="w-4 h-4 animate-spin" />
				</DisplayIf>
				<DisplayIf condition={!query.isLoading && !!query.data}>
					<ReactCountUpWrapper value={query.data} />
				</DisplayIf>
				<DisplayIf condition={!query.isLoading && query.data === undefined}>"-"</DisplayIf>
			</span>
		</Link>
	);
};

export default UserAvailableCreditsBadge;
