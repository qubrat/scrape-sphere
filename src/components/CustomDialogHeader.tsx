'use client';
import React from 'react';
import { DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type CustomDialogHeaderProps = {
	icon?: React.ElementType;
	title?: string;
	subTitle?: string;
	iconClassName?: string;
	titleClassName?: string;
	subTitleClassName?: string;
};

function CustomDialogHeader(props: CustomDialogHeaderProps) {
	return (
		<DialogHeader className="py-6">
			<DialogTitle asChild>
				<div className="flex flex-col items-center gap-2 mb-2">
					{props.icon && <props.icon size={30} className={cn('stroke-primary', props.iconClassName)} />}
					{props.title && <p className={cn('text-xl text-primary', props.titleClassName)}>{props.title}</p>}
					{props.title && <p className={cn('text-sm text-muted-foreground', props.subTitleClassName)}>{props.subTitle}</p>}
				</div>
			</DialogTitle>
			<Separator />
		</DialogHeader>
	);
}

export default CustomDialogHeader;
