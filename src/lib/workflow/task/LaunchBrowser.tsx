import { Task, TaskParam } from '@/types/task';
import { GlobeIcon, LucideProps } from 'lucide-react';

export const LaunchBrowserTask = {
	type: Task.LAUNCH_BROWSER,
	label: 'Launch browser',
	icon: (props: LucideProps) => <GlobeIcon className="stroke-pink-400" {...props} />,
	isEntryPoint: true,
	inputs: [
		{
			name: 'Website URL',
			type: TaskParam.STRING,
			helperText: 'eg. https://www.google.com',
			required: true,
			hideHandle: true
		}
	]
};
