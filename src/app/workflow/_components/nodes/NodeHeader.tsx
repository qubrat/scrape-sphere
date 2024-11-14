'use client';
import DisplayIf from '@/components/DisplayIf';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createFlowNode } from '@/lib/workflow/createFlowNode';
import { TaskRegistry } from '@/lib/workflow/task/Registry';
import { AppNode } from '@/types/appNode';
import { TaskType } from '@/types/task';
import { useReactFlow } from '@xyflow/react';
import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from 'lucide-react';
import React from 'react';

type NodeHeaderProps = {
	taskType: TaskType;
	nodeId: string;
};

function NodeHeader({ taskType, nodeId }: NodeHeaderProps) {
	const task = TaskRegistry[taskType];

	const { deleteElements, getNode, addNodes } = useReactFlow();

	const handleDeleteButtonClick = () => {
		deleteElements({
			nodes: [{ id: nodeId }]
		});
	};

	const handleDuplicateButtonClick = () => {
		const node = getNode(nodeId) as AppNode;
		const newX = node.position.x + 60;
		const newY = node.position.y + 40;
		const newNode = createFlowNode(node.data.type, { x: newX, y: newY });
		addNodes([newNode]);
	};

	return (
		<div className="flex items-center gap-2 p-2">
			<task.icon size={16} />
			<div className="flex items-center justify-between w-full">
				<p className="text-xs font-bold uppercase text-muted-foreground">{task.label}</p>
				<div className="flex gap-1 items-center">
					<DisplayIf condition={!!task.isEntryPoint}>
						<div className="flex gap-1 items-center">
							<Badge>Entry point</Badge>
						</div>
					</DisplayIf>
					<Badge className="gap-2 flex items-center text-xs">
						<CoinsIcon size={16} />
						{task.credits}
					</Badge>
					<DisplayIf condition={!task.isEntryPoint}>
						<Button variant={'ghost'} size={'icon'} className="cursor-pointer hover:text-destructive" onClick={handleDeleteButtonClick}>
							<TrashIcon size={12} />
						</Button>
						<Button
							variant={'ghost'}
							size={'icon'}
							className="cursor-pointer hover:text-muted-foreground"
							onClick={handleDuplicateButtonClick}
						>
							<CopyIcon size={12} />
						</Button>
					</DisplayIf>
					<Button variant={'ghost'} size={'icon'} className="drag-handle cursor-grab">
						<GripVerticalIcon size={12} />
					</Button>
				</div>
			</div>
		</div>
	);
}

export default NodeHeader;
