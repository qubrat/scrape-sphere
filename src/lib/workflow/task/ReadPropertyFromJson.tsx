import { Task, TaskParam } from '@/types/task';
import { WorkflowTaskType } from '@/types/workflow';
import { FileJson2Icon } from 'lucide-react';

export const ReadPropertyFromJsonTask = {
	type: Task.READ_PROPERTY_FROM_JSON,
	label: 'Read property from JSON',
	icon: (props) => <FileJson2Icon className="stroke-orange-400" {...props} />,
	isEntryPoint: false,
	credits: 1,
	inputs: [
		{
			name: 'JSON',
			type: TaskParam.STRING,
			required: true
		},
		{
			name: 'Property name',
			type: TaskParam.STRING,
			required: true
		}
	] as const,
	outputs: [{ name: 'Property value', type: TaskParam.STRING }] as const
} satisfies WorkflowTaskType;
