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

export const WorkflowExecutionStatus = {
	PENDING: 'PENDING',
	RUNNING: 'RUNNING',
	COMPLETED: 'COMPLETED',
	FAILED: 'FAILED'
} as const;
export type WorkflowExecutionStatusType = keyof typeof WorkflowExecutionStatus;

export const WorkflowExecutionTrigger = {
	MANUAL: 'MANUAL',
	CRON: 'CRON'
} as const;
export type WorkflowExecutionTriggerType = keyof typeof WorkflowExecutionTrigger;

export const ExecutionPhaseStatus = {
	CREATED: 'CREATED',
	PENDING: 'PENDING',
	RUNNING: 'RUNNING',
	COMPLETED: 'COMPLETED',
	FAILED: 'FAILED'
} as const;
export type ExecutionPhaseStatusType = keyof typeof ExecutionPhaseStatus;

export type WorkflowExecution = {
	id: string;
	workflowId: string;
	userId: string;
	trigger: WorkflowExecutionTriggerType;
	status: WorkflowExecutionStatusType;
	createdAt: Date;
	startedAt?: Date | null;
	completedAt?: Date | null;
	phases: ExecutionPhase[];
	creditsConsumed?: number | null;
	workflow: Workflow;
};

export type ExecutionPhase = {
	id: string;
	userId: string;
	status: ExecutionPhaseStatusType;
	number: number;
	node: string;
	name: string;
	startedAt?: Date | null;
	completedAt?: Date | null;
	inputs?: string | null;
	outputs?: string | null;
	creditsConsumed?: number | null;
	workflowExecutionId: string;
	execution: WorkflowExecution;
};

export type Workflow = {
	id: string;
	userId: string;
	name: string;
	description?: string | null;
	definition: string;
	status: WorkflowStatusType;
	lastRunAt?: Date | null;
	lastRunId?: string | null;
	lastRunStatus?: string | null;
	createdAt: Date;
	updatedAt: Date;
	executions: WorkflowExecution[];
};
