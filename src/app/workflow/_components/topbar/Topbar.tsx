'use client';
import TooltipWrapper from '@/components/TooltipWrapper';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import SaveButton from '@/app/workflow/_components/topbar/SaveButton';

type TopbarProps = {
	title: string;
	workflowId: string;
	subtitle?: string;
};

function Topbar({ title, subtitle, workflowId }: TopbarProps) {
	const router = useRouter();
	return (
		<header className="flex p-2 border-b-2 justify-between items-center bg-background sticky top-0 z-10">
			<div className="flex gap-1 flex-1">
				<TooltipWrapper content="Back">
					<Button variant={'ghost'} size="icon" onClick={() => router.back()}>
						<ChevronLeftIcon size={20} />
					</Button>
				</TooltipWrapper>
				<div className="">
					<p className="font-bold text-ellipsis truncate">{title}</p>
					{subtitle && <p className="text-xs text-muted-foreground truncate text-ellipsis">{subtitle}</p>}
				</div>
			</div>
			<div className="flex gap-1 flex-1 justify-end">
				<SaveButton workflowId={workflowId} />
			</div>
		</header>
	);
}

export default Topbar;