import { TaskParam, TaskParamType } from '@/types/task';

export const HandleColor: Record<TaskParamType, string> = {
	[TaskParam.BROWSER_INSTANCE]: '!bg-sky-400',
	[TaskParam.STRING]: '!bg-amber-400'
};