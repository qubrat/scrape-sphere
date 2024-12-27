'use client';
import TooltipWrapper from '@/components/TooltipWrapper';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import SaveButton from '@/app/workflow/_components/topbar/SaveButton';
import ExecuteButton from '@/app/workflow/_components/topbar/ExecuteButton';
import NavigationTabs from '@/app/workflow/_components/topbar/NavigationTabs';
import DisplayIf from '@/components/DisplayIf';
import PublishButton from './PublishButton';
import UnpublishButton from './UnpublishButton';
import BackButton from './BackButton';

type TopbarProps = {
	title: string;
	workflowId: string;
	subtitle?: string;
	hideButtons?: boolean;
	isPublished?: boolean;
	path?: string;
};

function Topbar({ title, subtitle, workflowId, hideButtons = false, isPublished = false, path }: TopbarProps) {
	return (
		<header className="flex p-2 gap-1 border-b-2 justify-between items-center bg-background sticky top-0 z-10">
			<div className="flex gap-1 flex-1">
				<BackButton path={path} />
				<div className="">
					<p className="font-bold text-ellipsis truncate">{title}</p>
					{subtitle && <p className="text-xs text-muted-foreground truncate text-ellipsis">{subtitle}</p>}
				</div>
			</div>
			<NavigationTabs workflowId={workflowId} />
			<div className="flex gap-1 flex-1 justify-end">
				<DisplayIf condition={!hideButtons}>
					<ExecuteButton workflowId={workflowId} />
					<DisplayIf condition={isPublished}>
						<UnpublishButton workflowId={workflowId} />
					</DisplayIf>
					<DisplayIf condition={!isPublished}>
						<SaveButton workflowId={workflowId} />
						<PublishButton workflowId={workflowId} />
					</DisplayIf>
				</DisplayIf>
			</div>
		</header>
	);
}

export default Topbar;
