import { Task, TaskParam } from '@/types/task';
import { WorkflowTaskType } from '@/types/workflow';
import { SendIcon } from 'lucide-react';

export const DeliverViaWebhookTask = {
	type: Task.DELIVER_VIA_WEBHOOK,
	label: 'Deliver via Webhook',
	icon: (props) => <SendIcon className="stroke-blue-400" {...props} />,
	isEntryPoint: false,
	credits: 1,
	inputs: [
		{
			name: 'Target URL',
			type: TaskParam.STRING,
			required: true
		},
		{
			name: 'Body',
			type: TaskParam.STRING,
			required: true
		}
	] as const,
	outputs: [{ name: 'Status code', type: TaskParam.STRING }] as const
} satisfies WorkflowTaskType;
