import { AppNode } from '@/types/appNode';
import { WorkflowExecutionPlan, WorkflowExecutionPlanPhase } from '@/types/workflow';
import { Edge, getIncomers } from '@xyflow/react';
import { TaskRegistry } from './task/Registry';
import { TaskParamSchema } from '@/types/task';

type FlowToExecutionPlanType = {
	executionPlan?: WorkflowExecutionPlan;
};

function flowToExecutionPlan(nodes: AppNode[], edges: Edge[]): FlowToExecutionPlanType {
	const entryPoint = nodes.find((node) => TaskRegistry[node.data.type].isEntryPoint);

	if (!entryPoint) {
		throw new Error('TODO: HANDLE THIS ERROR');
	}

	const planned = new Set<string>();
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
					throw new Error('TODO: HANDLE ERROR 1');
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
