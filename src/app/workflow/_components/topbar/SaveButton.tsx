'use client';

import { updateWorkflow } from '@/actions/workflows/updateWorkflow';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { CheckIcon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

type SaveButtonProps = {
	workflowId: string;
};

function SaveButton({ workflowId }: SaveButtonProps) {
	const { toObject } = useReactFlow();

	const saveMutation = useMutation({
		mutationFn: updateWorkflow,
		onSuccess: () => {
			toast.success('Workflow saved successfully', { id: 'save-workflow' });
		},
		onError: () => {
			toast.error('Something went wrong', { id: 'save-workflow' });
		}
	});

	const handleSave = () => {
		const definition = JSON.stringify(toObject());
		toast.loading('Saving workflow...', { id: 'save-workflow' });
		saveMutation.mutate({ id: workflowId, definition });
	};

	return (
		<Button variant={'outline'} className="flex items-center gap-2" onClick={handleSave} disabled={saveMutation.isPending}>
			<CheckIcon size={16} className="stroke-primary" />
			Save
		</Button>
	);
}

export default SaveButton;
