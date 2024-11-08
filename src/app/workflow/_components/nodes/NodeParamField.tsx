'use client';
import { TaskParam, TaskParamSchema } from '@/types/task';
import React, { useCallback } from 'react';
import StringParam from './params/StringParam';
import { useReactFlow } from '@xyflow/react';
import { AppNode } from '@/types/appNode';

type NodeParamFieldProps = {
	param: TaskParamSchema;
	nodeId: string;
};

function NodeParamField({ param, nodeId }: NodeParamFieldProps) {
	const { updateNodeData, getNode } = useReactFlow();
	const node = getNode(nodeId) as AppNode;
	const value = node?.data.inputs?.[param.name];

	const updateNodeParamValue = useCallback(
		(newValue: string) => {
			updateNodeData(nodeId, {
				...node?.data,
				inputs: {
					...node?.data.inputs,
					[param.name]: newValue
				}
			});
		},
		[updateNodeData, param.name, node?.data.inputs, nodeId]
	);

	switch (param.type) {
		case TaskParam.STRING:
			return <StringParam param={param} value={value} updateNodeParamValue={updateNodeParamValue} />;
		default:
			return (
				<div className="w-full">
					<p className="text-xs text-muted-foreground">Not implemented</p>
				</div>
			);
	}
}

export default NodeParamField;