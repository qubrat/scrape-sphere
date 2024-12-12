import ExecutionStatusIndicator, { ExecutionStatusLabel } from '@/app/workflow/runs/[workflowId]/_components/ExecutionStatusIndicator';
import DisplayIf from '@/components/DisplayIf';
import { WorkflowExecutionStatusType, WorkflowStatus } from '@/types/workflow';
import { Workflow } from '@prisma/client';
import { format, formatDistanceToNow } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { ArrowRightIcon, ChevronRightIcon, ClockIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type LastRunDetailsProps = {
	workflow: Workflow;
};

const LastRunDetails = ({ workflow }: LastRunDetailsProps) => {
	const isDraft = workflow.status === WorkflowStatus.DRAFT;
	if (isDraft) return null;

	const { lastRunAt, lastRunStatus, lastRunId, nextRunAt } = workflow;
	const formattedStartedAt = lastRunAt && formatDistanceToNow(lastRunAt, { addSuffix: true });
	const nextSchedule = nextRunAt && format(nextRunAt, 'yyyy-MM-dd HH:mm');
	const nextScheduleUTC = nextRunAt && formatInTimeZone(nextRunAt, 'UTC', 'HH:mm');
	return (
		<div className="bg-primary/5 px-4 py-1 flex items-center justify-between text-muted-foreground">
			<div className="flex items-center text-sm gap-2">
				<DisplayIf condition={!!lastRunAt}>
					<Link href={`/workflow/runs/${workflow.id}/${lastRunId}`} className="flex items-center text-sm gap-2 group">
						<span>Last run:</span>
						<ExecutionStatusIndicator status={lastRunStatus as WorkflowExecutionStatusType} />
						<ExecutionStatusLabel status={lastRunStatus as WorkflowExecutionStatusType} />
						<span>{formattedStartedAt}</span>
						<ChevronRightIcon size={14} className="-translate-x-1 group-hover:translate-x-0 transition-all" />
					</Link>
				</DisplayIf>
				<DisplayIf condition={!lastRunAt}>
					<p>No runs have been triggered yet</p>
				</DisplayIf>
			</div>
			<DisplayIf condition={!!nextRunAt}>
				<div className="flex items-center text-sm gap-2">
					<ClockIcon size={14} />
					<span>Next run at</span>
					<span>{nextSchedule}</span>
					<span className="text-xs">({nextScheduleUTC} UTC)</span>
				</div>
			</DisplayIf>
		</div>
	);
};

export default LastRunDetails;
