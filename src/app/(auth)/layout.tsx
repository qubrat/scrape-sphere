import { Logo } from '@/components/Logo';
import React from 'react';

type AuthLayoutProps = {
	children: React.ReactNode;
};

function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<div className="flex flex-col items-center justify-center h-screen gap-4">
			<Logo />
			{children}
		</div>
	);
}

export default AuthLayout;
