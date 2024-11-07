'use client';
import { deleteWorkflow } from '@/actions/workflows/deleteWorkflow';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

type DeleteWorkflowDialogProps = {
	open: boolean;
	setOpen: (value: boolean) => void;
	workflowName: string;
	workflowId: string;
};

function DeleteWorkflowDialog({ open, setOpen, workflowName, workflowId }: DeleteWorkflowDialogProps) {
	const [confirmText, setConfirmText] = useState('');

	const deleteMutation = useMutation({
		mutationFn: deleteWorkflow,
		onSuccess: () => {
			toast.success('Workflow deleted successfully', { id: workflowId });
			setConfirmText('');
		},
		onError: () => {
			toast.error('Something went wrong', { id: workflowId });
		}
	});

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="text-xl">Are you absolutely sure?</AlertDialogTitle>
					<div className="text-muted-foreground">
						If you delete this workflow you will not be able to recover it.
						<div className="flex flex-col py-4 gap-2">
							<p>
								If you are sure, enter <b>{workflowName}</b> to confirm:
							</p>
							<Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
						</div>
					</div>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => setConfirmText('')}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						disabled={confirmText !== workflowName || deleteMutation.isPending}
						onClick={() => {
							toast.loading('Deleting workflow...', { id: workflowId });
							deleteMutation.mutate(workflowId);
						}}
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default DeleteWorkflowDialog;
