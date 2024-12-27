'use client';
import { TaskParam, TaskParamSchema } from '@/types/task';
import React, { useCallback } from 'react';
import StringParam from './params/StringParam';
import { useReactFlow } from '@xyflow/react';
import { AppNode } from '@/types/appNode';
import BrowserInstanceParam from './params/BrowserInstanceParam';
import SelectParam from './params/SelectParam';
import CredentialsParam from './params/CredentialsParam';

type NodeParamFieldProps = {
	param: TaskParamSchema;
	nodeId: string;
	disabled?: boolean;
	hasError?: boolean;
};

function NodeParamField({ param, nodeId, disabled = false, hasError = false }: NodeParamFieldProps) {
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
			return <StringParam param={param} value={value} updateNodeParamValue={updateNodeParamValue} disabled={disabled} hasError={hasError} />;
		case TaskParam.BROWSER_INSTANCE:
			return <BrowserInstanceParam param={param} value={''} updateNodeParamValue={updateNodeParamValue} hasError={hasError} />;
		case TaskParam.SELECT:
			return <SelectParam param={param} value={value} updateNodeParamValue={updateNodeParamValue} hasError={hasError} />;
		case TaskParam.CREDENTIAL:
			return <CredentialsParam param={param} value={value} updateNodeParamValue={updateNodeParamValue} hasError={hasError} />;
		default:
			return (
				<div className="w-full">
					<p className="text-xs text-muted-foreground">Not implemented</p>
				</div>
			);
	}
}

export default NodeParamField;
