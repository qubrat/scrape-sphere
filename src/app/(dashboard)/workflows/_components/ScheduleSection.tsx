import { CoinsIcon, CornerDownRightIcon, MoveRightIcon } from 'lucide-react';
import React from 'react';
import SchedulerDialog from '@/app/(dashboard)/workflows/_components/SchedulerDialog';
import TooltipWrapper from '@/components/TooltipWrapper';
import { Badge } from '@/components/ui/badge';

type ScheduleSectionProps = {
	isDraft: boolean;
	creditsCost: number;
	workflowId: string;
	cron: string | null;
};

const ScheduleSection = ({ isDraft, creditsCost, workflowId, cron }: ScheduleSectionProps) => {
	if (isDraft) return null;
	return (
		<div className="flex items-center gap-2">
			<CornerDownRightIcon className="h-4 w-4 text-muted-foreground" />
			<SchedulerDialog workflowId={workflowId} initialCron={cron} />
			<MoveRightIcon className="h-4 w-4 text-muted-foreground" />
			<TooltipWrapper content="Credit consumption for full run">
				<div className="flex items-center gap-3">
					<Badge variant={'outline'} className="space-x-2 text-muted-foreground rounded-sm">
						<CoinsIcon className="h-4 w-4" />
						<span className="text-sm">{creditsCost}</span>
					</Badge>
				</div>
			</TooltipWrapper>
		</div>
	);
};

export default ScheduleSection;
