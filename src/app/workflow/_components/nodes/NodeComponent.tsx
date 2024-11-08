import { NodeProps } from '@xyflow/react';
import { memo } from 'react';
import NodeCard from '@/app/workflow/_components/nodes/NodeCard';
import NodeHeader from '@/app/workflow/_components/nodes/NodeHeader';
import { AppNodeData } from '@/types/appNode';
import { TaskRegistry } from '@/lib/workflow/task/Registry';
import { NodeInputs, NodeInput } from '@/app/workflow/_components/nodes/NodeInputs';

const NodeComponent = memo((props: NodeProps) => {
	const nodeData = props.data as AppNodeData;
	const task = TaskRegistry[nodeData.type];
	return (
		<NodeCard nodeId={props.id} isSelected={!!props.selected}>
			<NodeHeader taskType={nodeData.type}></NodeHeader>
			<NodeInputs>
				{task.inputs.map((input, index) => (
					<NodeInput key={index} input={input} nodeId={props.id} />
				))}
			</NodeInputs>
		</NodeCard>
	);
});

export default NodeComponent;
NodeComponent.displayName = 'NodeComponent';