import { Task, TaskParam } from '@/types/task';
import { WorkflowTaskType } from '@/types/workflow';
import { Edit3Icon } from 'lucide-react';

export const FillInputTask = {
	type: Task.FILL_INPUT,
	label: 'Fill input',
	icon: (props) => <Edit3Icon className="stroke-orange-400" {...props} />,
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
			name: 'Value',
			type: TaskParam.STRING,
			required: true
		}
	] as const,
	outputs: [{ name: 'Web page', type: TaskParam.BROWSER_INSTANCE }] as const
} satisfies WorkflowTaskType;
