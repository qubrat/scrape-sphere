import { Task, TaskParam } from '@/types/task';
import { WorkflowTaskType } from '@/types/workflow';
import { GlobeIcon, LucideProps } from 'lucide-react';

export const LaunchBrowserTask = {
	type: Task.LAUNCH_BROWSER,
	label: 'Launch browser',
	icon: (props: LucideProps) => <GlobeIcon className="stroke-pink-400" {...props} />,
	isEntryPoint: true,
	credits: 5,
	inputs: [
		{
			name: 'Website URL',
			type: TaskParam.STRING,
			helperText: 'eg. https://www.google.com',
			required: true,
			hideHandle: true
		}
	] as const,
	outputs: [{ name: 'Web page', type: TaskParam.BROWSER_INSTANCE }] as const
} satisfies WorkflowTaskType;
