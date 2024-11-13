import { Task, TaskParam } from '@/types/task';
import { LucideProps, TextIcon } from 'lucide-react';

export const ExtractTextFromElementTask = {
	type: Task.EXTRACT_TEXT_FROM_ELEMENT,
	label: 'Extract text from element',
	icon: (props: LucideProps) => <TextIcon className="stroke-rose-400" {...props} />,
	isEntryPoint: false,
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
	],
	outputs: [{ name: 'Extracted text', type: TaskParam.STRING }]
};
