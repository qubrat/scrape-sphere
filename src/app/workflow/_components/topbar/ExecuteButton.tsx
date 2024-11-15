'use client';
import useExecutionPlan from '@/components/hooks/useExecutionPlan';
import { Button } from '@/components/ui/button';
import { PlayIcon } from 'lucide-react';
import React from 'react';

type ExecuteButtonProps = {
	workflowId: string;
};

function ExecuteButton({ workflowId }: ExecuteButtonProps) {
	const generate = useExecutionPlan();

	const handleGenerate = () => {
		const executionPlan = generate();
		console.log(executionPlan);
	};

	return (
		<Button variant={'outline'} className="flex items-center gap-2" onClick={handleGenerate}>
			<PlayIcon size={16} className="stroke-orange-400" />
			Execute
		</Button>
	);
}

export default ExecuteButton;
