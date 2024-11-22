// executionPlan.test.ts

import { AppNode } from '@/types/appNode';
import { Edge } from '@xyflow/react';
import { getIncomers } from '@/lib/workflow/executionPlan/getIncomers'; // Assuming the function is exported from this file

describe('getIncomers', () => {
	const createMockNode = (id: string): AppNode => ({
		id,
		type: 'ScrapeSphereNode',
		dragHandle: '.drag-handle',
		data: {
			type: 'LAUNCH_BROWSER',
			inputs: {}
		},
		position: { x: 0, y: 0 }
	});

	const createMockEdge = (source: string, target: string): Edge => ({
		id: `${source}-${target}`,
		source,
		target
	});

	it('should return an empty array if there are no incoming edges', () => {
		const node = createMockNode('1');
		const nodes = [node, createMockNode('2')];
		const edges: Edge[] = [];

		const result = getIncomers(node, nodes, edges);
		expect(result).toEqual([]);
	});

	it('should return correct incoming nodes', () => {
		const targetNode = createMockNode('target');
		const incomingNode1 = createMockNode('in1');
		const incomingNode2 = createMockNode('in2');
		const unrelatedNode = createMockNode('unrelated');

		const nodes = [targetNode, incomingNode1, incomingNode2, unrelatedNode];
		const edges = [createMockEdge('in1', 'target'), createMockEdge('in2', 'target'), createMockEdge('unrelated', 'someOtherTarget')];

		const result = getIncomers(targetNode, nodes, edges);
		expect(result).toHaveLength(2);
		expect(result).toContainEqual(incomingNode1);
		expect(result).toContainEqual(incomingNode2);
		expect(result).not.toContainEqual(unrelatedNode);
	});

	it('should handle multiple edges from the same source', () => {
		const targetNode = createMockNode('target');
		const incomingNode = createMockNode('in');

		const nodes = [targetNode, incomingNode];
		const edges = [
			createMockEdge('in', 'target'),
			createMockEdge('in', 'target') // Duplicate edge
		];

		const result = getIncomers(targetNode, nodes, edges);
		expect(result).toHaveLength(1);
		expect(result).toContainEqual(incomingNode);
	});

	it('should return an empty array if no incoming nodes are found in the nodes array', () => {
		const targetNode = createMockNode('target');
		const incomingNode = createMockNode('in');

		const nodes = [targetNode]; // incomingNode is not in the nodes array
		const edges = [createMockEdge('in', 'target')];

		const result = getIncomers(targetNode, nodes, edges);
		expect(result).toEqual([]);
	});
});
