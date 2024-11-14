import { LucideProps } from 'lucide-react';
import { TaskParamSchema, TaskParamType, TaskType } from './task';

export const WorkflowStatus = {
	DRAFT: 'DRAFT',
	PUBLISHED: 'PUBLISHED'
} as const;

export type WorkflowStatusType = keyof typeof WorkflowStatus;

export type WorkflowTaskType = {
	label: string;
	icon: React.FC<LucideProps>;
	type: TaskType;
	isEntryPoint?: boolean;
	inputs: TaskParamSchema[];
	outputs: TaskParamSchema[];
	credits: number;
};
