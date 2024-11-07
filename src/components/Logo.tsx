import { cn } from '@/lib/utils';
import { OrbitIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const bgGradient = 'bg-gradient-to-r from-primary to-emerald-600';

type LogoProps = {
	fontSize?: 'text-xl' | 'text-2xl';
	iconSize?: number;
};

const Logo = ({ fontSize = 'text-2xl', iconSize = 20 }: LogoProps) => {
	return (
		<Link href="/" className={cn('text-2xl font-extrabold flex items-center gap-2', fontSize)}>
			<div className={`rounded-xl ${bgGradient} p-2`}>
				<OrbitIcon size={iconSize} className="stroke-white" />
			</div>
			<div>
				<span className={`${bgGradient} bg-clip-text text-transparent`}>Scrape</span>
				<span className="text-stone-700 dark:text-stone-300">Sphere</span>
			</div>
		</Link>
	);
};

export { Logo };
