'use client';
import { runWorkflow } from '@/actions/workflows/runWorkflow';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { Loader2Icon, PlayIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

type RunButtonProps = {
	workflowId: string;
};

const RunButton = ({ workflowId }: RunButtonProps) => {
	const router = useRouter();

	const mutation = useMutation({
		mutationFn: runWorkflow,
		mutationKey: ['runWorkflow', workflowId],
		onSuccess: (data) => {
			toast.success('Workflow started', { id: workflowId });
			if (data.success) {
				router.push(`/workflow/runs/${workflowId}/${data.executionId}`);
			}
		},
		onError: () => {
			toast.error('Something went wrong', { id: workflowId });
		}
	});

	const handleClick = () => {
		toast.loading('Scheduling run...', { id: workflowId });
		mutation.mutate({ workflowId });
	};

	return (
		<Button variant="outline" size={'sm'} className="flex items-center gap-2" disabled={mutation.isPending} onClick={handleClick}>
			{mutation.isPending ? <Loader2Icon size={16} className="stroke-violet-500 animate-spin" /> : <PlayIcon size={16} />}
			Run
		</Button>
	);
};

export default RunButton;
