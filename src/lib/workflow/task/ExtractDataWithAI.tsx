import { Task, TaskParam } from '@/types/task';
import { WorkflowTaskType } from '@/types/workflow';
import { SparklesIcon } from 'lucide-react';

export const ExtractDataWithAITask = {
	type: Task.EXTRACT_DATA_WITH_AI,
	label: 'Extract data with AI',
	icon: (props) => <SparklesIcon className="stroke-rose-400" {...props} />,
	isEntryPoint: false,
	credits: 4,
	inputs: [
		{
			name: 'Content',
			type: TaskParam.STRING,
			required: true
		},
		{
			name: 'Credentials',
			type: TaskParam.CREDENTIAL,
			required: true
		},
		{
			name: 'Prompt',
			type: TaskParam.STRING,
			required: true,
			variant: 'textarea'
		}
	] as const,
	outputs: [{ name: 'Extracted data', type: TaskParam.STRING }] as const
} satisfies WorkflowTaskType;
