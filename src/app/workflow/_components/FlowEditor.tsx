'use client';
import { Workflow } from '@prisma/client';
import {
	addEdge,
	Background,
	BackgroundVariant,
	Connection,
	Controls,
	Edge,
	getOutgoers,
	ReactFlow,
	useEdgesState,
	useNodesState,
	useReactFlow
} from '@xyflow/react';
import React, { useCallback, useEffect } from 'react';
import { TaskType } from '@/types/task';

import '@xyflow/react/dist/style.css';
import { createFlowNode } from '@/lib/workflow/createFlowNode';
import NodeComponent from '@/app/workflow/_components/nodes/NodeComponent';
import { AppNode } from '@/types/appNode';
import DeletableEdge from '@/app/workflow/_components/edges/DeletableEdge';
import { TaskRegistry } from '@/lib/workflow/task/Registry';

const nodeTypes = {
	ScrapeSphereNode: NodeComponent
};

const edgeTypes = {
	default: DeletableEdge
};

const snapGrid: [number, number] = [42, 42];
const fitViewOptions = { padding: 1 };

type FlowEditorProps = {
	workflow: Workflow;
};

function FlowEditor({ workflow }: FlowEditorProps) {
	const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
	const { screenToFlowPosition, updateNodeData } = useReactFlow();

	useEffect(() => {
		try {
			const flow = JSON.parse(workflow.definition);
			if (!flow) return;

			setNodes(flow.nodes || []);
			setEdges(flow.edges || []);
		} catch (error) {}
	}, [workflow.definition, setNodes, setEdges]);

	const onDragOver = useCallback((event: React.DragEvent) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}, []);

	const onDrop = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault();
			const type = event.dataTransfer.getData('application/reactflow');
			if (typeof type === 'undefined' || !type) return;

			const position = screenToFlowPosition({
				x: event.clientX,
				y: event.clientY
			});

			const node = createFlowNode(type as TaskType, position);
			setNodes((nodes) => nodes.concat(node));
		},
		[screenToFlowPosition, setNodes]
	);

	const onConnect = useCallback(
		(connection: Connection) => {
			setEdges((edges) => addEdge({ ...connection, animated: true }, edges));
			if (!connection.targetHandle) return;

			const targetNode = nodes.find((node) => node.id === connection.target);
			if (!targetNode) return;

			const nodeInputs = targetNode.data.inputs;
			updateNodeData(targetNode.id, {
				inputs: {
					...nodeInputs,
					[connection.targetHandle]: ''
				}
			});
			delete nodeInputs[connection.targetHandle];
			updateNodeData(targetNode.id, { inputs: nodeInputs });
		},
		[setEdges, updateNodeData, nodes]
	);

	const isValidConnection = useCallback(
		(connection: Edge | Connection) => {
			if (connection.source === connection.target) {
				console.error('Invalid connection: source and target are the same', connection);
				return false;
			}

			const sourceNode = nodes.find((node) => node.id === connection.source);
			const targetNode = nodes.find((node) => node.id === connection.target);
			if (!sourceNode || !targetNode) {
				console.error('Invalid connection: node not found', { sourceNode, targetNode });
				return false;
			}

			const sourceTask = TaskRegistry[sourceNode.data.type];
			const targetTask = TaskRegistry[targetNode.data.type];

			const output = sourceTask.outputs.find((output) => output.name === connection.sourceHandle);
			const input = targetTask.inputs.find((input) => input.name === connection.targetHandle);

			if (input?.type !== output?.type) {
				console.error('Invalid connection: type mismatch', { output, input });
				return false;
			}

			const hasCycle = (node: AppNode, visited = new Set()) => {
				if (visited.has(node.id)) return false;
				visited.add(node.id);

				for (const outgoer of getOutgoers(node, nodes, edges)) {
					if (outgoer.id === connection.source) return true;
					if (hasCycle(outgoer, visited)) return true;
				}
			};

			const detectedCycle = hasCycle(targetNode);

			return !detectedCycle;
		},
		[nodes, edges]
	);

	return (
		<main className="h-full w-full">
			<ReactFlow
				nodes={nodes}
				onNodesChange={onNodesChange}
				edges={edges}
				onEdgesChange={onEdgesChange}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				snapToGrid
				snapGrid={snapGrid}
				fitView
				fitViewOptions={fitViewOptions}
				onDragOver={onDragOver}
				onDrop={onDrop}
				onConnect={onConnect}
				isValidConnection={isValidConnection}
			>
				<Controls position="top-left" fitViewOptions={fitViewOptions} />
				<Background variant={BackgroundVariant.Dots} gap={14} size={1} />
			</ReactFlow>
		</main>
	);
}

export default FlowEditor;
