'use client';

import Link from 'next/link';
import { CoinsIcon, HomeIcon, ShieldCheckIcon, WorkflowIcon } from 'lucide-react';
import Logo from './Logo';
import { buttonVariants } from './ui/button';
import { usePathname } from 'next/navigation';

type Route = {
	href: string;
	label: string;
	icon: React.ElementType;
};

const routes: Route[] = [
	{
		href: '',
		label: 'Home',
		icon: HomeIcon
	},
	{
		href: 'workflows',
		label: 'Workflows',
		icon: WorkflowIcon
	},
	{
		href: 'credentials',
		label: 'Credentials',
		icon: ShieldCheckIcon
	},
	{
		href: 'billing',
		label: 'Billing',
		icon: CoinsIcon
	}
];

const SidebarItems = () => {
	const pathname = usePathname();
	const activeRoute = routes.find((route) => route.href.length > 0 && pathname.includes(route.href)) || routes[0];

	console.log(activeRoute);

	return routes.map((route: Route) => (
		<Link
			key={route.href}
			href={`/${route.href}`}
			className={buttonVariants({
				variant: activeRoute.href === route.href ? 'sidebarActiveItem' : 'sidebarItem'
			})}
		>
			<route.icon size={20} />
			{route.label}
		</Link>
	));
};

const DesktopSidebar = () => {
	return (
		<div className="hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate">
			<div className="flex items-center justify-center gap-2 border-b-[1px] border-separate p-4">
				<Logo />
			</div>
			<div className="p-2">TODO CREDITS</div>
			<div className="flex flex-col p-2">
				<SidebarItems />
			</div>
		</div>
	);
};

export { DesktopSidebar };
