import { AppNode } from '@/types/appNode';
import { TaskParamSchema } from '@/types/task';
import { TaskRegistry } from '@/lib/workflow/task/Registry';
import { Edge } from '@xyflow/react';

function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>): TaskParamSchema[] {
	const invalidInputs: TaskParamSchema[] = [];
	const inputs = TaskRegistry[node.data.type].inputs;
	const incomingEdges = edges.filter((edge) => edge.target === node.id);

	for (const input of inputs) {
		const inputValue = node.data.inputs[input.name];
		const inputValueProvided = inputValue != null && inputValue !== '';

		if (inputValueProvided) {
			continue; // This input is valid
		}

		const inputLinkedToOutput = incomingEdges.find((edge) => edge.targetHandle === input.name);
		const linkedOutputIsPlanned = inputLinkedToOutput && planned.has(inputLinkedToOutput.source);

		if (input.required) {
			if (!linkedOutputIsPlanned) {
				invalidInputs.push(input);
			}
		} else {
			// For optional inputs
			if (inputLinkedToOutput && !linkedOutputIsPlanned) {
				invalidInputs.push(input);
			}
		}
	}

	return invalidInputs;
}

export { getInvalidInputs };
