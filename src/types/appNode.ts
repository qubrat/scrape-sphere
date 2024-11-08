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

type StringParamProps = {
	param: TaskParamSchema;
	value: string;
	updateNodeParamValue: (newValue: string) => void;
};

export type { AppNodeData, AppNode, StringParamProps };
