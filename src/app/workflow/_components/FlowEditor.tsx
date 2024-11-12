'use client';
import { Workflow } from '@prisma/client';
import {
	addEdge,
	Background,
	BackgroundVariant,
	Connection,
	Controls,
	Edge,
	ReactFlow,
	useEdgesState,
	useNodesState,
	useReactFlow
} from '@xyflow/react';
import React, { use, useCallback, useEffect } from 'react';
import { Task, TaskType } from '@/types/task';

import '@xyflow/react/dist/style.css';
import { createFlowNode } from '@/lib/workflow/createFlowNode';
import NodeComponent from '@/app/workflow/_components/nodes/NodeComponent';
import { AppNode } from '@/types/appNode';

const nodeTypes = {
	ScrapeSphereNode: NodeComponent
};

const snapGrid: [number, number] = [42, 42];
const fitViewOptions = { padding: 1 };

type FlowEditorProps = {
	workflow: Workflow;
};

function FlowEditor({ workflow }: FlowEditorProps) {
	const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
	const { screenToFlowPosition } = useReactFlow();

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

	const onDrop = useCallback((event: React.DragEvent) => {
		event.preventDefault();
		const type = event.dataTransfer.getData('application/reactflow');
		if (typeof type === 'undefined' || !type) return;

		const position = screenToFlowPosition({
			x: event.clientX,
			y: event.clientY
		});

		const node = createFlowNode(type as TaskType, position);
		setNodes((nodes) => nodes.concat(node));
	}, []);

	const onConnect = useCallback((connection: Connection) => {
		setEdges((edges) => addEdge({ ...connection, animated: true }, edges));
	}, []);

	return (
		<main className="h-full w-full">
			<ReactFlow
				nodes={nodes}
				onNodesChange={onNodesChange}
				edges={edges}
				onEdgesChange={onEdgesChange}
				nodeTypes={nodeTypes}
				snapToGrid
				snapGrid={snapGrid}
				fitView
				fitViewOptions={fitViewOptions}
				onDragOver={onDragOver}
				onDrop={onDrop}
				onConnect={onConnect}
			>
				<Controls position="top-left" fitViewOptions={fitViewOptions} />
				<Background variant={BackgroundVariant.Dots} gap={14} size={1} />
			</ReactFlow>
		</main>
	);
}

export default FlowEditor;
