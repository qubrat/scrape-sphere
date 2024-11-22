import { AppNode, AppNodeMissingInputs } from '@/types/appNode';
import { WorkflowExecutionPlan, WorkflowExecutionPlanPhase } from '@/types/workflow';
import { Edge, getIncomers } from '@xyflow/react';
import { TaskRegistry } from '@/lib/workflow/task/Registry';
import { getInvalidInputs } from '@/lib/workflow/executionPlan/getInvalidInputs';

export const FlowToExecutionPlanValidationError = {
	NO_ENTRY_POINT: 'NO_ENTRY_POINT',
	INVALID_INPUTS: 'INVALID_INPUTS'
} as const;

export type FlowToExecutionPlanValidationErrorType = (typeof FlowToExecutionPlanValidationError)[keyof typeof FlowToExecutionPlanValidationError];

type FlowToExecutionPlanType = {
	executionPlan?: WorkflowExecutionPlan;
	error?: {
		type: FlowToExecutionPlanValidationErrorType;
		invalidElements?: AppNodeMissingInputs[];
	};
};

function flowToExecutionPlan(nodes: AppNode[], edges: Edge[]): FlowToExecutionPlanType {
	function processNode(node: AppNode, phase: number): boolean {
		const invalidInputs = getInvalidInputs(node, edges, planned);
		if (invalidInputs.length > 0) {
			const incomers = getIncomers(node, nodes, edges);
			if (incomers.every((incomer) => planned.has(incomer.id))) {
				console.error('Invalid inputs', node.id, invalidInputs);
				inputsWithErrors.push({ nodeId: node.id, inputs: invalidInputs.map((input) => input.name) });
			} else {
				return false;
			}
		}

		if (!executionPlan[phase - 1]) {
			executionPlan[phase - 1] = { phase, nodes: [] };
		}
		executionPlan[phase - 1].nodes.push(node);
		planned.add(node.id);
		return true;
	}

	const entryPoint = nodes.find((node) => TaskRegistry[node.data.type].isEntryPoint);
	if (!entryPoint) {
		return { error: { type: FlowToExecutionPlanValidationError.NO_ENTRY_POINT } };
	}

	const inputsWithErrors: AppNodeMissingInputs[] = [];
	const planned = new Set<string>();
	const executionPlan: WorkflowExecutionPlan = [];

	processNode(entryPoint, 1);

	let phase = 2;
	while (planned.size < nodes.length) {
		let nodeProcessed = false;
		for (const node of nodes) {
			if (!planned.has(node.id) && processNode(node, phase)) {
				nodeProcessed = true;
			}
		}
		if (!nodeProcessed) break;
		phase++;
	}

	if (inputsWithErrors.length > 0) {
		return { error: { type: FlowToExecutionPlanValidationError.INVALID_INPUTS, invalidElements: inputsWithErrors } };
	}

	return { executionPlan };
}

export { flowToExecutionPlan };
