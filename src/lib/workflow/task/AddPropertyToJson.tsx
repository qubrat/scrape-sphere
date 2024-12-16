import { Task, TaskParam } from '@/types/task';
import { WorkflowTaskType } from '@/types/workflow';
import { DatabaseIcon } from 'lucide-react';

export const AddPropertyToJsonTask = {
	type: Task.ADD_PROPERTY_TO_JSON,
	label: 'Add property to JSON',
	icon: (props) => <DatabaseIcon className="stroke-orange-400" {...props} />,
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
		},
		{
			name: 'Property value',
			type: TaskParam.STRING,
			required: true
		}
	] as const,
	outputs: [{ name: 'Updated JSON', type: TaskParam.STRING }] as const
} satisfies WorkflowTaskType;
