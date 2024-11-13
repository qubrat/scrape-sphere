import { Button } from '@/components/ui/button';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath, useReactFlow } from '@xyflow/react';
import { XIcon } from 'lucide-react';
import React from 'react';

export default function DeletableEdge(props: EdgeProps) {
	const [edgePath, labelX, labelY] = getSmoothStepPath(props);
	const { setEdges } = useReactFlow();

	const handleDeleteEdge = () => {
		setEdges((edges) => edges.filter((edge) => edge.id !== props.id));
	};

	return (
		<>
			<BaseEdge path={edgePath} markerEnd={props.markerEnd} style={props.style} />
			<EdgeLabelRenderer>
				<div
					style={{
						position: 'absolute',
						transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
						pointerEvents: 'all'
					}}
				>
					<Button
						variant={'outline'}
						size={'icon'}
						className="w-6 h-6 border cursor-pointer rounded-full text-xs leading-none hover:shadow-sm hover:text-destructive"
						onClick={handleDeleteEdge}
					>
						<XIcon size={16} />
					</Button>
				</div>
			</EdgeLabelRenderer>
		</>
	);
}
