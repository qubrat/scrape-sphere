'use client';
import { Workflow } from '@prisma/client';
import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import FlowEditor from './FlowEditor';
import Topbar from './topbar/Topbar';

type EditorProps = {
	workflow: Workflow;
};

function Editor({ workflow }: EditorProps) {
	return (
		<ReactFlowProvider>
			<div className="flex flex-col h-full w-full overflow-hidden">
				<Topbar title={'Workflow editor'} subtitle={workflow.name} workflowId={workflow.id} />
				<section className="flex h-full overflow-auto">
					<FlowEditor workflow={workflow}></FlowEditor>
				</section>
			</div>
		</ReactFlowProvider>
	);
}

export default Editor;
