import { LucideProps } from 'lucide-react';
import { TaskParamSchema, TaskType } from '@/types/task';
import { AppNode } from './appNode';

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

export type WorkflowExecutionPlanPhase = {
	phase: number;
	nodes: AppNode[];
};

export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[];
