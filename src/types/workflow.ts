export const WorkflowStatus = {
	DRAFT: 'DRAFT',
	PUBLISHED: 'PUBLISHED'
} as const;

export type WorkflowStatusType = keyof typeof WorkflowStatus;
