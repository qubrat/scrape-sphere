import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type TooltipWrapperProps = {
	children: React.ReactNode;
	content: React.ReactNode;
	side?: 'top' | 'right' | 'bottom' | 'left';
};

function TooltipWrapper({ children, content, side }: TooltipWrapperProps) {
	if (!content) return children;

	return (
		<TooltipProvider delayDuration={0}>
			<Tooltip>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent side={side}>{content}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

export default TooltipWrapper;
