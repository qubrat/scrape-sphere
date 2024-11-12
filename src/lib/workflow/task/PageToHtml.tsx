import { Task, TaskParam } from '@/types/task';
import { CodeIcon, LucideProps } from 'lucide-react';

export const PageToHtml = {
	type: Task.PAGE_TO_HTML,
	label: 'Get HTML from page',
	icon: (props: LucideProps) => <CodeIcon className="stroke-rose-400" {...props} />,
	isEntryPoint: false,
	inputs: [
		{
			name: 'Web page',
			type: TaskParam.BROWSER_INSTANCE,
			required: true
		}
	],
	outputs: [
		{ name: 'HTML', type: TaskParam.STRING },
		{ name: 'Web page', type: TaskParam.BROWSER_INSTANCE }
	]
};
