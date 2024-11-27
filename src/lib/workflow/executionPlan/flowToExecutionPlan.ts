import { AppNode, AppNodeMissingInputs } from '@/types/appNode';
import { WorkflowExecutionPlan, WorkflowExecutionPlanPhase } from '@/types/workflow';
import { Edge } from '@xyflow/react';
import { TaskRegistry } from '@/lib/workflow/task/Registry';
import { getInvalidInputs } from '@/lib/workflow/executionPlan/getInvalidInputs';
import { getIncomers } from './getIncomers';

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
	const entryPoint = nodes.find((node) => TaskRegistry[node.data.type].isEntryPoint);
	if (!entryPoint) {
		return { error: { type: FlowToExecutionPlanValidationError.NO_ENTRY_POINT } };
	}

	const planned = new Set<string>();
	const inputsWithErrors: AppNodeMissingInputs[] = [];
	const executionPlan: WorkflowExecutionPlan = [];
	const nodeMap = new Map(nodes.map((node) => [node.id, node]));
	const outgoingEdges = groupEdgesBySource(edges);

	function planNode(node: AppNode, phase: number) {
		if (planned.has(node.id)) return;

		const invalidInputs = getInvalidInputs(node, edges, planned);
		if (invalidInputs.length > 0) {
			const incomers = getIncomers(node, nodes, edges);
			if (incomers.every((incomer) => planned.has(incomer.id))) {
				inputsWithErrors.push({ nodeId: node.id, inputs: invalidInputs.map((input) => input.name) });
			} else {
				return;
			}
		}

		planned.add(node.id);
		if (!executionPlan[phase - 1]) executionPlan[phase - 1] = { phase, nodes: [] };
		executionPlan[phase - 1].nodes.push(node);

		const nextNodes = outgoingEdges.get(node.id) || [];
		for (const edge of nextNodes) {
			const nextNode = nodeMap.get(edge.target);
			if (nextNode) planNode(nextNode, phase + 1);
		}
	}

	planNode(entryPoint, 1);

	if (inputsWithErrors.length > 0) {
		return { error: { type: FlowToExecutionPlanValidationError.INVALID_INPUTS, invalidElements: inputsWithErrors } };
	}

	return { executionPlan };
}

function groupEdgesBySource(edges: Edge[]): Map<string, Edge[]> {
	return edges.reduce((map, edge) => {
		if (!map.has(edge.source)) map.set(edge.source, []);
		map.get(edge.source)!.push(edge);
		return map;
	}, new Map<string, Edge[]>());
}

export { flowToExecutionPlan };
