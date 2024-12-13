import { Task, TaskParam } from '@/types/task';
import { WorkflowTaskType } from '@/types/workflow';
import { EyeIcon } from 'lucide-react';

export const WaitForElementTask = {
	type: Task.WAIT_FOR_ELEMENT,
	label: 'Wait for element',
	icon: (props) => <EyeIcon className="stroke-amber-400" {...props} />,
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
		},
		{
			name: 'Visibility',
			type: TaskParam.SELECT,
			hideHandle: true,
			required: true,
			options: [
				{ label: 'Visible', value: 'visible' },
				{ label: 'Hidden', value: 'hidden' }
			]
		}
	] as const,
	outputs: [{ name: 'Web page', type: TaskParam.BROWSER_INSTANCE }] as const
} satisfies WorkflowTaskType;
