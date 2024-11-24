import Link from 'next/link';
import { Workflow } from '@prisma/client';
import { cn } from '@/lib/utils';
import { WorkflowStatus, WorkflowStatusType } from '@/types/workflow';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileTextIcon, PlayIcon, ReplaceIcon } from 'lucide-react';
import WorkflowActionsButton from './WorkflowActionsButton';

const statusColors: Record<WorkflowStatusType, string> = {
	[WorkflowStatus.DRAFT]: 'bg-amber-400 ',
	[WorkflowStatus.PUBLISHED]: 'bg-primary'
};

// Draft Badge
type DraftBadgeProps = {
	isDraft: boolean;
};

const DraftBadge = ({ isDraft }: DraftBadgeProps) => {
	if (!isDraft) return null;

	return <span className="ml-2 px-2 py0.5 text-xs font-semibold bg-amber-100 text-amber-600 rounded-full">Draft</span>;
};

// Workflow Card
type WorkflowCardProps = {
	workflow: Workflow;
};

function WorkflowCard({ workflow }: WorkflowCardProps) {
	const isDraft = workflow.status === WorkflowStatus.DRAFT;

	return (
		<Card className="border border-separate shadow-sm rounded-lg overflow-hidden transition-shadow  hover:shadow-md dark:shadow-primary/30">
			<CardContent className="p-4 flex items-center justify-between h-[100px]">
				<div className="flex items-center justify-end space-x-3">
					<div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-white', statusColors[workflow.status])}>
						{isDraft ? <FileTextIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5 text-white" />}
					</div>
					<div>
						<h3 className="text-base font-bold text-muted-foreground flex items-center">
							<Link className="flex items-center hover:underline" href={`/workflow/editor/${workflow.id}`}>
								{workflow.name}
							</Link>
							<DraftBadge isDraft={isDraft} />
						</h3>
					</div>
				</div>
				<div className="flex items-center space-x-2">
					<Link
						className={cn(
							buttonVariants({
								variant: 'outline',
								size: 'sm'
							}),
							'flex items-center gap-2'
						)}
						href={`/workflow/editor/${workflow.id}`}
					>
						<ReplaceIcon size={16} /> Edit
					</Link>
					<WorkflowActionsButton workflowName={workflow.name} workflowId={workflow.id} />
				</div>
			</CardContent>
		</Card>
	);
}

export default WorkflowCard;
