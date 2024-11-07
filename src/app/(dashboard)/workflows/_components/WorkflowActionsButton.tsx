'use client';
import React, { useState } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import TooltipWrapper from '@/components/TooltipWrapper';
import { MoreVerticalIcon, TrashIcon } from 'lucide-react';
import DeleteWorkflowDialog from './DeleteWorkflowDialog';

type WorkflowActionsButtonProps = {
	workflowName: string;
	workflowId: string;
};

function WorkflowActionsButton({ workflowName, workflowId }: WorkflowActionsButtonProps) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	return (
		<>
			<DeleteWorkflowDialog open={showDeleteDialog} setOpen={setShowDeleteDialog} workflowName={workflowName} workflowId={workflowId} />
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="sm" className="px-0">
						<TooltipWrapper content="More actions">
							<div className="flex items-center justify-center w-full h-full">
								<MoreVerticalIcon size={18} className="mx-3" />
							</div>
						</TooltipWrapper>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="text-destructive flex items-center gap-2"
						onSelect={() => {
							setShowDeleteDialog((prev) => !prev);
						}}
					>
						<TrashIcon />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}

export default WorkflowActionsButton;
