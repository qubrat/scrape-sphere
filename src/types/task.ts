export const Task = {
	LAUNCH_BROWSER: 'LAUNCH_BROWSER',
	PAGE_TO_HTML: 'PAGE_TO_HTML'
} as const;

export type TaskType = keyof typeof Task;

export const TaskParam = {
	STRING: 'STRING',
	BROWSER_INSTANCE: 'BROWSER_INSTANCE'
} as const;

export type TaskParamType = keyof typeof TaskParam;

export type TaskParamSchema = {
	name: string;
	type: TaskParamType;
	helperText?: string;
	required?: boolean;
	hideHandle?: boolean;
	[key: string]: any;
};
