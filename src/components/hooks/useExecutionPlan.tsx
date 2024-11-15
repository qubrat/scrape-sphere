import { flowToExecutionPlan } from '@/lib/workflow/executionPlan';
import { AppNode } from '@/types/appNode';
import { useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';

const useExecutionPlan = () => {
	const { toObject } = useReactFlow();
	const generateExecutionPlan = useCallback(() => {
		const { nodes, edges } = toObject();
		const { executionPlan } = flowToExecutionPlan(nodes as AppNode[], edges);
		return executionPlan;
	}, [toObject]);

	return generateExecutionPlan;
};

export default useExecutionPlan;
