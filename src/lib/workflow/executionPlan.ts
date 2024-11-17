import { AppNode, AppNodeMissingInputs } from '@/types/appNode';
import { WorkflowExecutionPlan, WorkflowExecutionPlanPhase } from '@/types/workflow';
import { Edge, getIncomers } from '@xyflow/react';
import { TaskRegistry } from './task/Registry';
import { TaskParamSchema } from '@/types/task';

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

	const inputsWithErrors: AppNodeMissingInputs[] = [];
	const planned = new Set<string>();

	const invalidInputs = getInvalidInputs(entryPoint, edges, planned);
	if (invalidInputs.length > 0) {
		inputsWithErrors.push({ nodeId: entryPoint.id, inputs: invalidInputs.map((input) => input.name) });
	}

	const executionPlan: WorkflowExecutionPlan = [{ phase: 1, nodes: [entryPoint] }];

	planned.add(entryPoint.id);

	for (let phase = 2; phase <= nodes.length && planned.size < nodes.length; phase++) {
		const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };
		for (const currentNode of nodes) {
			if (planned.has(currentNode.id)) {
				// Node already put in the execution plan
				continue;
			}

			const invalidInputs = getInvalidInputs(currentNode, edges, planned);
			if (invalidInputs.length > 0) {
				const incomers = getIncomers(currentNode, nodes, edges);
				if (incomers.every((incomer) => planned.has(incomer.id))) {
					console.error('Invalid inputs', currentNode.id, invalidInputs);
					inputsWithErrors.push({ nodeId: currentNode.id, inputs: invalidInputs.map((input) => input.name) });
				} else {
					continue;
				}
			}

			nextPhase.nodes.push(currentNode);
		}
		for (const node of nextPhase.nodes) {
			planned.add(node.id);
		}
		executionPlan.push(nextPhase);
	}

	if (inputsWithErrors.length > 0) {
		return { error: { type: FlowToExecutionPlanValidationError.INVALID_INPUTS, invalidElements: inputsWithErrors } };
	}

	return { executionPlan };
}

function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>): TaskParamSchema[] {
	const invalidInputs = [];
	const inputs = TaskRegistry[node.data.type].inputs;

	for (const input of inputs) {
		const inputValue = node.data.inputs[input.name];
		const inputValueProvided = inputValue?.length > 0;
		if (inputValueProvided) {
			// This input is valid
			continue;
		}

		const incomingEdges = edges.filter((edge) => edge.target === node.id);
		const inputLinkedToOutput = incomingEdges.find((edge) => edge.targetHandle === input.name);

		const requiredInputProvidedByVisitedOutput = input.required && inputLinkedToOutput && planned.has(inputLinkedToOutput.source);

		if (requiredInputProvidedByVisitedOutput) {
			continue;
		} else if (!input.required) {
			if (!inputLinkedToOutput) {
				continue;
			}
			if (inputLinkedToOutput && planned.has(inputLinkedToOutput.source)) {
				continue;
			}
		}

		invalidInputs.push(input);
	}
	return invalidInputs;
}

export { flowToExecutionPlan };
