import { AppNode } from '@/types/appNode';
import { TaskType } from '@/types/task';

export function createFlowNode(nodeType: TaskType, position?: { x: number; y: number }): AppNode {
	return {
		id: crypto.randomUUID(),
		type: 'ScrapeSphereNode',
		dragHandle: '.drag-handle',
		data: {
			type: nodeType,
			inputs: {}
		},
		position: position ?? { x: 0, y: 0 }
	};
}
