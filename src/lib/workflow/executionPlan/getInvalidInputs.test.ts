// getInvalidInputs.test.ts

import { AppNode } from '@/types/appNode';
import { Edge } from '@xyflow/react';
import { TaskType } from '@/types/task';
import { getInvalidInputs } from '@/lib/workflow/executionPlan/getInvalidInputs';

jest.mock('@/lib/workflow/task/Registry', () => ({
	TaskRegistry: {
		TEST_TASK: {
			inputs: [
				{ name: 'required1', type: 'STRING', required: true },
				{ name: 'required2', type: 'STRING', required: true },
				{ name: 'optional1', type: 'STRING', required: false },
				{ name: 'optional2', type: 'STRING', required: false }
			]
		}
	}
}));

describe('getInvalidInputs', () => {
	const createMockNode = (id: string, inputs: Record<string, string> = {}): AppNode => ({
		id,
		type: 'ScrapeSphereNode',
		dragHandle: '.drag-handle',
		data: {
			type: 'TEST_TASK' as TaskType,
			inputs
		},
		position: { x: 0, y: 0 }
	});

	const createMockEdge = (source: string, target: string, targetHandle: string): Edge => ({
		id: `${source}-${target}`,
		source,
		target,
		targetHandle
	});

	it('should return all required inputs as invalid when no inputs are provided', () => {
		const node = createMockNode('1');
		const result = getInvalidInputs(node, [], new Set());
		expect(result).toHaveLength(2);
		expect(result.map((input) => input.name)).toEqual(['required1', 'required2']);
	});

	it('should not return inputs that have values as invalid', () => {
		const node = createMockNode('1', { required1: 'value', optional1: 'value' });
		const result = getInvalidInputs(node, [], new Set());
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe('required2');
	});

	it('should not return required inputs as invalid if they are linked to planned outputs', () => {
		const node = createMockNode('1');
		const edges = [createMockEdge('source1', '1', 'required1'), createMockEdge('source2', '1', 'required2')];
		const planned = new Set(['source1', 'source2']);
		const result = getInvalidInputs(node, edges, planned);
		expect(result).toHaveLength(0);
	});

	it('should return required inputs as invalid if they are linked to unplanned outputs', () => {
		const node = createMockNode('1');
		const edges = [createMockEdge('source1', '1', 'required1'), createMockEdge('source2', '1', 'required2')];
		const planned = new Set(['source1']); // source2 is unplanned
		const result = getInvalidInputs(node, edges, planned);
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe('required2');
	});

	it('should not return optional inputs as invalid if they are not linked', () => {
		const node = createMockNode('1', { required1: 'value', required2: 'value' });
		const result = getInvalidInputs(node, [], new Set());
		expect(result).toHaveLength(0);
	});

	it('should not return optional inputs as invalid if they are linked to planned outputs', () => {
		const node = createMockNode('1', { required1: 'value', required2: 'value' });
		const edges = [createMockEdge('source', '1', 'optional1')];
		const planned = new Set(['source']);
		const result = getInvalidInputs(node, edges, planned);
		expect(result).toHaveLength(0);
	});

	it('should return optional inputs as invalid if they are linked to unplanned outputs', () => {
		const node = createMockNode('1', { required1: 'value', required2: 'value' });
		const edges = [createMockEdge('source', '1', 'optional1')];
		const planned = new Set<string>();
		const result = getInvalidInputs(node, edges, planned);
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe('optional1');
	});

	it('should handle a mix of valid and invalid inputs', () => {
		const node = createMockNode('1', { required1: 'value' });
		const edges = [createMockEdge('source1', '1', 'required2'), createMockEdge('source2', '1', 'optional1')];
		const planned = new Set(['source1']);
		const result = getInvalidInputs(node, edges, planned);
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe('optional1');
	});

	it('should handle empty node inputs, no edges, and empty planned set', () => {
		const node = createMockNode('1', {});
		const result = getInvalidInputs(node, [], new Set());
		expect(result).toHaveLength(2);
		expect(result.map((input) => input.name)).toEqual(['required1', 'required2']);
	});

	it('should not return optional inputs as invalid when they are not provided and not linked', () => {
		const node = createMockNode('1', { required1: 'value', required2: 'value' });
		const result = getInvalidInputs(node, [], new Set());
		expect(result).toHaveLength(0);
	});

	it('should return all inputs as invalid when required inputs are missing and optional inputs are linked to unplanned outputs', () => {
		const node = createMockNode('1');
		const edges = [createMockEdge('source1', '1', 'optional1'), createMockEdge('source2', '1', 'optional2')];
		const planned = new Set<string>();
		const result = getInvalidInputs(node, edges, planned);
		expect(result).toHaveLength(4);
		expect(result.map((input) => input.name)).toEqual(['required1', 'required2', 'optional1', 'optional2']);
	});
});
