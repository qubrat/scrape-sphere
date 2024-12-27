import { Task, TaskParam } from '@/types/task';
import { WorkflowTaskType } from '@/types/workflow';
import { Link2Icon } from 'lucide-react';

export const NavigateUrlTask = {
	type: Task.NAVIGATE_URL,
	label: 'Navigate URL',
	icon: (props) => <Link2Icon className="stroke-orange-400" {...props} />,
	isEntryPoint: false,
	credits: 2,
	inputs: [
		{
			name: 'Web page',
			type: TaskParam.BROWSER_INSTANCE,
			required: true
		},
		{
			name: 'URL',
			type: TaskParam.STRING,
			required: true
		}
	] as const,
	outputs: [{ name: 'Web page', type: TaskParam.BROWSER_INSTANCE }] as const
} satisfies WorkflowTaskType;
