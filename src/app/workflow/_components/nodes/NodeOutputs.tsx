import { cn } from '@/lib/utils';
import { TaskParamSchema } from '@/types/task';
import { Handle, Position } from '@xyflow/react';
import React from 'react';
import { HandleColor } from './common';

type NodeOutputsProps = {
	children?: React.ReactNode;
};

function NodeOutputs({ children }: NodeOutputsProps) {
	return <div className="flex flex-col divide-y gap-2">{children}</div>;
}

type NodeOutputProps = {
	output: TaskParamSchema;
	nodeId: string;
};

function NodeOutput({ output, nodeId }: NodeOutputProps) {
	return (
		<div className="flex justify-end relative p-3 bg-secondary/50 w-full last:rounded-b-md">
			<p className="text-xs text-muted-foreground">{output.name}</p>
			<Handle
				id={output.name}
				type="source"
				position={Position.Right}
				className={cn('!bg-muted-foreground !border-2 !border-background !-right-2 !w-4 !h-4', HandleColor[output.type])}
			/>
		</div>
	);
}

export { NodeOutputs, NodeOutput };
