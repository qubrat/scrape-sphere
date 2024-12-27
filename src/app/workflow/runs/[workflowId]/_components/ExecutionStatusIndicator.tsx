import { cn } from '@/lib/utils';
import { WorkflowExecutionStatusType } from '@/types/workflow';
import React from 'react';

type ExecutionStatusIndicatorProps = {
	status: WorkflowExecutionStatusType;
};

const indicatorColors: Record<WorkflowExecutionStatusType, string> = {
	PENDING: 'bg-slate-400',
	RUNNING: 'bg-yellow-500',
	COMPLETED: 'bg-green-500',
	FAILED: 'bg-red-400'
};

const ExecutionStatusIndicator = ({ status }: ExecutionStatusIndicatorProps) => {
	return <div className={cn('w-2 h-2 rounded-full bg-slate', indicatorColors[status])} />;
};

const labelColors: Record<WorkflowExecutionStatusType, string> = {
	PENDING: 'text-slate-400',
	RUNNING: 'text-yellow-500',
	COMPLETED: 'text-green-500',
	FAILED: 'text-red-400'
};

const ExecutionStatusLabel = ({ status }: ExecutionStatusIndicatorProps) => {
	return <span className={cn('lowercase', labelColors[status])}>{status}</span>;
};

export default ExecutionStatusIndicator;
export { ExecutionStatusLabel };
