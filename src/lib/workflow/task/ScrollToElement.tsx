import { Task, TaskParam } from '@/types/task';
import { WorkflowTaskType } from '@/types/workflow';
import { ArrowDownIcon } from 'lucide-react';

export const ScrollToElementTask = {
	type: Task.SCROLL_TO_ELEMENT,
	label: 'Scroll to element',
	icon: (props) => <ArrowDownIcon className="stroke-orange-400" {...props} />,
	isEntryPoint: false,
	credits: 1,
	inputs: [
		{
			name: 'Web page',
			type: TaskParam.BROWSER_INSTANCE,
			required: true
		},
		{
			name: 'Selector',
			type: TaskParam.STRING,
			required: true
		}
	] as const,
	outputs: [{ name: 'Web page', type: TaskParam.BROWSER_INSTANCE }] as const
} satisfies WorkflowTaskType;
