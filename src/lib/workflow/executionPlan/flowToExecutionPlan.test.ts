import { flowToExecutionPlan, FlowToExecutionPlanValidationError } from './flowToExecutionPlan';
import { AppNode } from '@/types/appNode';
import { Edge } from '@xyflow/react';

// Add this at the top of your test file
const originalConsoleError = console.error;
beforeAll(() => {
	console.error = jest.fn();
});

afterAll(() => {
	console.error = originalConsoleError;
});

// Mock the Task import
jest.mock('@/types/task', () => ({
	Task: {
		LAUNCH_BROWSER: 'LAUNCH_BROWSER',
		PAGE_TO_HTML: 'PAGE_TO_HTML'
	}
}));

// Mock dependencies
jest.mock('@/lib/workflow/task/Registry', () => ({
	TaskRegistry: {
		LAUNCH_BROWSER: { isEntryPoint: true },
		PAGE_TO_HTML: { isEntryPoint: false }
	}
}));

jest.mock('@/lib/workflow/executionPlan/getIncomers', () => ({
	getIncomers: jest.fn()
}));

// Mock getInvalidInputs
jest.mock('@/lib/workflow/executionPlan/getInvalidInputs', () => ({
	getInvalidInputs: jest.fn()
}));

// Now import Task and mocked functions after mocking
import { Task } from '@/types/task';
import { getInvalidInputs } from '@/lib/workflow/executionPlan/getInvalidInputs';

describe('flowToExecutionPlan', () => {
	beforeEach(() => {
		(getInvalidInputs as jest.Mock).mockReturnValue([]);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should return NO_ENTRY_POINT error when there is no entry point', () => {
		const nodes: AppNode[] = [{ id: '1', data: { type: Task.PAGE_TO_HTML, inputs: {} }, position: { x: 0, y: 0 } }];
		const edges: Edge[] = [];

		const result = flowToExecutionPlan(nodes, edges);

		expect(result).toEqual({
			error: { type: FlowToExecutionPlanValidationError.NO_ENTRY_POINT }
		});
	});

	it('should create a valid execution plan for a simple workflow', () => {
		const nodes: AppNode[] = [
			{ id: '1', data: { type: Task.LAUNCH_BROWSER, inputs: {} }, position: { x: 0, y: 0 } },
			{ id: '2', data: { type: Task.PAGE_TO_HTML, inputs: {} }, position: { x: 100, y: 0 } }
		];
		const edges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];

		const result = flowToExecutionPlan(nodes, edges);

		expect(result).toEqual({
			executionPlan: [
				{ phase: 1, nodes: [nodes[0]] },
				{ phase: 2, nodes: [nodes[1]] }
			]
		});
	});

	it('should handle invalid inputs and return INVALID_INPUTS error', () => {
		const nodes: AppNode[] = [
			{ id: '1', data: { type: Task.LAUNCH_BROWSER, inputs: {} }, position: { x: 0, y: 0 } },
			{ id: '2', data: { type: Task.PAGE_TO_HTML, inputs: {} }, position: { x: 100, y: 0 } }
		];
		const edges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];

		(getInvalidInputs as jest.Mock).mockReturnValueOnce([]).mockReturnValueOnce([{ name: 'missingInput' }]);

		const result = flowToExecutionPlan(nodes, edges);

		expect(result).toEqual({
			error: {
				type: FlowToExecutionPlanValidationError.INVALID_INPUTS,
				invalidElements: [{ nodeId: '2', inputs: ['missingInput'] }]
			}
		});
	});

	it('should handle a complex workflow with multiple phases', () => {
		const nodes: AppNode[] = [
			{ id: '1', data: { type: Task.LAUNCH_BROWSER, inputs: {} }, position: { x: 0, y: 0 } },
			{ id: '2', data: { type: Task.PAGE_TO_HTML, inputs: {} }, position: { x: 100, y: 0 } },
			{ id: '3', data: { type: Task.PAGE_TO_HTML, inputs: {} }, position: { x: 100, y: 100 } },
			{ id: '4', data: { type: Task.PAGE_TO_HTML, inputs: {} }, position: { x: 200, y: 50 } }
		];
		const edges: Edge[] = [
			{ id: 'e1-2', source: '1', target: '2' },
			{ id: 'e1-3', source: '1', target: '3' },
			{ id: 'e2-4', source: '2', target: '4' },
			{ id: 'e3-4', source: '3', target: '4' }
		];

		const result = flowToExecutionPlan(nodes, edges);

		expect(result).toEqual({
			executionPlan: [
				{ phase: 1, nodes: [nodes[0]] },
				{ phase: 2, nodes: [nodes[1], nodes[2], nodes[3]] }
			]
		});
	});

	it('should handle cycles in the workflow', () => {
		const nodes: AppNode[] = [
			{ id: '1', data: { type: Task.LAUNCH_BROWSER, inputs: {} }, position: { x: 0, y: 0 } },
			{ id: '2', data: { type: Task.PAGE_TO_HTML, inputs: {} }, position: { x: 100, y: 0 } },
			{ id: '3', data: { type: Task.PAGE_TO_HTML, inputs: {} }, position: { x: 200, y: 0 } }
		];
		const edges: Edge[] = [
			{ id: 'e1-2', source: '1', target: '2' },
			{ id: 'e2-3', source: '2', target: '3' },
			{ id: 'e3-2', source: '3', target: '2' } // Creates a cycle
		];

		const result = flowToExecutionPlan(nodes, edges);

		expect(result).toEqual({
			executionPlan: [
				{ phase: 1, nodes: [nodes[0]] },
				{ phase: 2, nodes: [nodes[1], nodes[2]] }
			]
		});
	});
});
