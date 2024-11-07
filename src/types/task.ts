export const Task = {
	LAUNCH_BROWSER: 'LAUNCH_BROWSER'
} as const;

export type TaskType = keyof typeof Task;
