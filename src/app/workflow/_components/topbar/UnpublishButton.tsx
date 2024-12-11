'use client';
import { unpublishWorkflow } from '@/actions/workflows/unpublishWorkflow';
import DisplayIf from '@/components/DisplayIf';
import useExecutionPlan from '@/components/hooks/useExecutionPlan';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { DownloadIcon, Loader2Icon, UploadIcon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

type UnpublishButtonProps = {
	workflowId: string;
};

function UnpublishButton({ workflowId }: UnpublishButtonProps) {
	const mutation = useMutation({
		mutationFn: unpublishWorkflow,
		onSuccess: () => {
			toast.success('Workflow unpublished', { id: workflowId });
		},
		onError: () => {
			toast.error('Something went wrong', { id: workflowId });
		}
	});

	const handlePublish = () => {
		toast.loading('Unpublishing workflow...', { id: workflowId });
		mutation.mutate(workflowId);
	};

	return (
		<Button variant={'outline'} className="flex items-center gap-2 " onClick={handlePublish} disabled={mutation.isPending}>
			<DisplayIf condition={!mutation.isPending}>
				<DownloadIcon size={16} className="stroke-violet-500" />
			</DisplayIf>
			<DisplayIf condition={mutation.isPending}>
				<Loader2Icon size={16} className="stroke-violet-500 animate-spin" />
			</DisplayIf>
			Unpublish
		</Button>
	);
}

export default UnpublishButton;
