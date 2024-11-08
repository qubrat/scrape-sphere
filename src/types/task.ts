export const Task = {
	LAUNCH_BROWSER: 'LAUNCH_BROWSER'
} as const;

export type TaskType = keyof typeof Task;

export const TaskParam = {
	STRING: 'STRING',
	NUMBER: 'NUMBER',
	BOOLEAN: 'BOOLEAN',
	OBJECT: 'OBJECT'
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
