import { NodeProps } from '@xyflow/react';
import { memo } from 'react';
import NodeCard from '@/app/workflow/_components/nodes/NodeCard';
import NodeHeader from '@/app/workflow/_components/nodes/NodeHeader';
import { AppNodeData } from '@/types/appNode';
import { TaskRegistry } from '@/lib/workflow/task/Registry';
import { NodeInputs, NodeInput } from '@/app/workflow/_components/nodes/NodeInputs';
import { NodeOutputs, NodeOutput } from '@/app/workflow/_components/nodes/NodeOutputs';

const NodeComponent = memo((props: NodeProps) => {
	const nodeData = props.data as AppNodeData;
	const task = TaskRegistry[nodeData.type];
	return (
		<NodeCard nodeId={props.id} isSelected={!!props.selected}>
			<NodeHeader taskType={nodeData.type} nodeId={props.id}></NodeHeader>
			<NodeInputs>
				{task.inputs.map((input, index) => (
					<NodeInput key={index} input={input} nodeId={props.id} />
				))}
			</NodeInputs>
			<NodeOutputs>
				{task.outputs.map((output, index) => (
					<NodeOutput key={index} output={output} nodeId={props.id} />
				))}
			</NodeOutputs>
		</NodeCard>
	);
});

export default NodeComponent;
NodeComponent.displayName = 'NodeComponent';
