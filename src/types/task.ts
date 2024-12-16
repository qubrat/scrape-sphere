export const Task = {
	LAUNCH_BROWSER: 'LAUNCH_BROWSER',
	PAGE_TO_HTML: 'PAGE_TO_HTML',
	EXTRACT_TEXT_FROM_ELEMENT: 'EXTRACT_TEXT_FROM_ELEMENT',
	FILL_INPUT: 'FILL_INPUT',
	CLICK_ELEMENT: 'CLICK_ELEMENT',
	WAIT_FOR_ELEMENT: 'WAIT_FOR_ELEMENT',
	DELIVER_VIA_WEBHOOK: 'DELIVER_VIA_WEBHOOK',
	EXTRACT_DATA_WITH_AI: 'EXTRACT_DATA_WITH_AI',
	READ_PROPERTY_FROM_JSON: 'READ_PROPERTY_FROM_JSON',
	ADD_PROPERTY_TO_JSON: 'ADD_PROPERTY_TO_JSON'
} as const;

export type TaskType = keyof typeof Task;

export const TaskParam = {
	STRING: 'STRING',
	BROWSER_INSTANCE: 'BROWSER_INSTANCE',
	SELECT: 'SELECT',
	CREDENTIAL: 'CREDENTIAL'
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
