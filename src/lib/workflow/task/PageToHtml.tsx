import { Task, TaskParam } from '@/types/task';
import { WorkflowTaskType } from '@/types/workflow';
import { CodeIcon, LucideProps } from 'lucide-react';

export const PageToHtmlTask = {
	type: Task.PAGE_TO_HTML,
	label: 'Get HTML from page',
	icon: (props: LucideProps) => <CodeIcon className="stroke-rose-400" {...props} />,
	isEntryPoint: false,
	credits: 2,
	inputs: [
		{
			name: 'Web page',
			type: TaskParam.BROWSER_INSTANCE,
			required: true
		}
	] as const,
	outputs: [
		{ name: 'HTML', type: TaskParam.STRING },
		{ name: 'Web page', type: TaskParam.BROWSER_INSTANCE }
	] as const
} satisfies WorkflowTaskType;
