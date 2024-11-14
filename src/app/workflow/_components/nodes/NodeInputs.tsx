import { cn } from '@/lib/utils';
import { TaskParamSchema } from '@/types/task';
import { Handle, Position, useEdges } from '@xyflow/react';
import React from 'react';
import NodeParamField from './NodeParamField';
import { HandleColor } from './common';
import DisplayIf from '@/components/DisplayIf';

type NodeInputsProps = {
	children?: React.ReactNode;
};

function NodeInputs({ children }: NodeInputsProps) {
	return <div className="flex flex-col divide-y gap-2">{children}</div>;
}

type NodeInputProps = {
	input: TaskParamSchema;
	nodeId: string;
};

function NodeInput({ input, nodeId }: NodeInputProps) {
	const edges = useEdges();
	const isConnected = edges.some((edge) => edge.target === nodeId && edge.targetHandle === input.name);

	return (
		<div className="flex justify-start relative p-3 bg-secondary w-full">
			<NodeParamField param={input} nodeId={nodeId} disabled={isConnected} />
			<DisplayIf condition={!input.hideHandle}>
				<Handle
					id={input.name}
					isConnectable={!isConnected}
					type="target"
					position={Position.Left}
					className={cn('!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4', HandleColor[input.type])}
				/>
			</DisplayIf>
		</div>
	);
}

export { NodeInputs, NodeInput };
