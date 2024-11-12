'use client';
import { cn } from '@/lib/utils';
import { useReactFlow } from '@xyflow/react';
import React from 'react';

type NodeCardProps = {
	children?: React.ReactNode;
	nodeId: string;
	isSelected?: boolean;
};

function NodeCard({ children, nodeId, isSelected }: NodeCardProps) {
	const { getNode, setCenter } = useReactFlow();

	const handleDoubleClick = () => {
		const node = getNode(nodeId);
		if (!node) return;
		const { position, measured } = node;
		if (!position || !measured) return;
		const { width, height } = measured;
		const x = position.x + width! / 2;
		const y = position.y + height! / 2;

		if (x === undefined || y === undefined) return;
		setCenter(x, y, { zoom: 1, duration: 500 });
	};

	return (
		<div
			onDoubleClick={handleDoubleClick}
			className={cn('rounded-md cursor-pointer bg-background border-2 w-[420px] text-xs gap-2 flex flex-col', isSelected && 'border-primary')}
		>
			{children}
		</div>
	);
}

export default NodeCard;
