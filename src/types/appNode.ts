import { Node } from '@xyflow/react';
import { TaskParamSchema, TaskType } from './task';

type AppNodeData = {
	type: TaskType;
	inputs: Record<string, string>;
	[key: string]: any;
};

interface AppNode extends Node {
	data: AppNodeData;
}

type ParamProps = {
	param: TaskParamSchema;
	value: string;
	disabled?: boolean;
	updateNodeParamValue: (newValue: string) => void;
};

type AppNodeMissingInputs = {
	nodeId: string;
	inputs: string[];
};

export type { AppNodeData, AppNode, ParamProps, AppNodeMissingInputs };
