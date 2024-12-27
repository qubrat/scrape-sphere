'use client';
import { publishWorkflow } from '@/actions/workflows/publishWorkflow';
import DisplayIf from '@/components/DisplayIf';
import useExecutionPlan from '@/components/hooks/useExecutionPlan';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { Loader2Icon, UploadIcon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

type PublishButtonProps = {
	workflowId: string;
};

function PublishButton({ workflowId }: PublishButtonProps) {
	const generate = useExecutionPlan();

	const { toObject } = useReactFlow();

	const mutation = useMutation({
		mutationFn: publishWorkflow,
		onSuccess: () => {
			toast.success('Workflow published', { id: workflowId });
		},
		onError: () => {
			toast.error('Something went wrong', { id: workflowId });
		}
	});

	const handlePublish = () => {
		const executionPlan = generate();
		if (!executionPlan) {
			return;
		}
		toast.loading('Publishing workflow...', { id: workflowId });
		mutation.mutate({ id: workflowId, flowDefinition: JSON.stringify(toObject()) });
	};

	return (
		<Button variant={'outline'} className="flex items-center gap-2 " onClick={handlePublish} disabled={mutation.isPending}>
			<DisplayIf condition={!mutation.isPending}>
				<UploadIcon size={16} className="stroke-violet-500" />
			</DisplayIf>
			<DisplayIf condition={mutation.isPending}>
				<Loader2Icon size={16} className="stroke-violet-500 animate-spin" />
			</DisplayIf>
			Publish
		</Button>
	);
}

export default PublishButton;
