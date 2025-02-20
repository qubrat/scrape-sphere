import { Logo } from '@/components/Logo';
import { ModeToggle } from '@/components/ThemeModeToggle';
import { Separator } from '@/components/ui/separator';
import React from 'react';

type WorkflowLayoutProps = {
	children: React.ReactNode;
};

function WorkflowLayout({ children }: WorkflowLayoutProps) {
	return (
		<div className="flex flex-col w-full h-screen">
			{children}
			<Separator />
			<footer className="flex items-center justify-between p-2">
				<Logo iconSize={16} fontSize="text-xl" />
				<ModeToggle />
			</footer>
		</div>
	);
}

export default WorkflowLayout;
