'use client';
import { runWorkflow } from '@/actions/workflows/runWorkflow';
import DisplayIf from '@/components/DisplayIf';
import useExecutionPlan from '@/components/hooks/useExecutionPlan';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { Loader2Icon, PlayIcon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

type ExecuteButtonProps = {
	workflowId: string;
};

function ExecuteButton({ workflowId }: ExecuteButtonProps) {
	const generate = useExecutionPlan();

	const { toObject } = useReactFlow();

	const mutation = useMutation({
		mutationFn: runWorkflow,
		onSuccess: () => {
			toast.success('Execution started', { id: 'flow-execution' });
		},
		onError: () => {
			toast.error('Something went wrong', { id: 'flow-execution' });
		}
	});

	const handleGenerate = () => {
		const executionPlan = generate();
		if (!executionPlan) {
			return;
		}
		mutation.mutate({ workflowId, flowDefinition: JSON.stringify(toObject()) });
	};

	return (
		<Button variant={'outline'} className="flex items-center gap-2 " onClick={handleGenerate} disabled={mutation.isPending}>
			<DisplayIf condition={!mutation.isPending}>
				<PlayIcon size={16} className="stroke-orange-400" />
			</DisplayIf>
			<DisplayIf condition={mutation.isPending}>
				<Loader2Icon size={16} className="stroke-orange-400 animate-spin" />
			</DisplayIf>
			Execute
		</Button>
	);
}

export default ExecuteButton;
