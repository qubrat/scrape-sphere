import { Task, TaskParam } from '@/types/task';
import { WorkflowTaskType } from '@/types/workflow';
import { LucideProps, TextIcon } from 'lucide-react';

export const ExtractTextFromElementTask = {
	type: Task.EXTRACT_TEXT_FROM_ELEMENT,
	label: 'Extract text from element',
	icon: (props: LucideProps) => <TextIcon className="stroke-rose-400" {...props} />,
	isEntryPoint: false,
	credits: 2,
	inputs: [
		{
			name: 'HTML',
			type: TaskParam.STRING,
			required: true,
			variant: 'textarea'
		},
		{
			name: 'Selector',
			type: TaskParam.STRING,
			required: true
		}
	] as const,
	outputs: [{ name: 'Extracted text', type: TaskParam.STRING }] as const
} satisfies WorkflowTaskType;
