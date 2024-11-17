import { flowToExecutionPlan, FlowToExecutionPlanValidationError } from '@/lib/workflow/executionPlan';
import { AppNode } from '@/types/appNode';
import { useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';
import useFlowValidation from './useFlowValidation';
import { toast } from 'sonner';

const useExecutionPlan = () => {
	const { toObject } = useReactFlow();

	const { setInvalidInputs, clearErrors } = useFlowValidation();

	const handleError = useCallback(
		(error: any) => {
			switch (error.type) {
				case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
					toast.error('Workflow has no entry point');
					break;
				case FlowToExecutionPlanValidationError.INVALID_INPUTS:
					toast.error('Not all inputs are set');
					setInvalidInputs(error.invalidElements);
					break;
				default:
					toast.error('Something went wrong');
					break;
			}
		},
		[setInvalidInputs]
	);

	const generateExecutionPlan = useCallback(() => {
		const { nodes, edges } = toObject();
		const { executionPlan, error } = flowToExecutionPlan(nodes as AppNode[], edges);
		if (error) {
			handleError(error);
			return null;
		}

		clearErrors();
		return executionPlan;
	}, [toObject, handleError, clearErrors]);

	return generateExecutionPlan;
};

export default useExecutionPlan;