'use client';
import { Workflow } from '@prisma/client';
import { Background, BackgroundVariant, Controls, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react';
import React, { useEffect } from 'react';
import { Task } from '@/types/task';

import '@xyflow/react/dist/style.css';
import { createFlowNode } from '@/lib/workflow/createFlowNode';
import NodeComponent from '@/app/workflow/_components/nodes/NodeComponent';

const nodeTypes = {
	ScrapeSphereNode: NodeComponent
};

const snapGrid: [number, number] = [42, 42];
const fitViewOptions = { padding: 1 };

type FlowEditorProps = {
	workflow: Workflow;
};

function FlowEditor({ workflow }: FlowEditorProps) {
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);

	useEffect(() => {
		try {
			const flow = JSON.parse(workflow.definition);
			if (!flow) return;

			setNodes(flow.nodes || []);
			setEdges(flow.edges || []);
		} catch (error) {}
	}, [workflow.definition, setNodes, setEdges]);

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
			>
				<Controls position="top-left" fitViewOptions={fitViewOptions} />
				<Background variant={BackgroundVariant.Dots} gap={14} size={1} />
			</ReactFlow>
		</main>
	);
}

export default FlowEditor;
