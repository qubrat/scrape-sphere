'use client';

import Link from 'next/link';
import { CoinsIcon, HomeIcon, MenuIcon, ShieldCheckIcon, WalletIcon, WorkflowIcon } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/Logo';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

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
		icon: WalletIcon
	}
];

type SidebarItemsProps = {
	mobile?: boolean;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarItems = ({ mobile, setOpen = () => {} }: SidebarItemsProps) => {
	const pathname = usePathname();
	const activeRoute = routes.find((route) => route.href.length > 0 && pathname.includes(route.href)) || routes[0];
	return routes.map((route: Route) => (
		<Link
			key={route.href}
			href={`/${route.href}`}
			className={buttonVariants({
				variant: activeRoute.href === route.href ? 'sidebarActiveItem' : 'sidebarItem'
			})}
			onClick={() => mobile && setOpen((prev) => !prev)}
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

const MobileSidebar = () => {
	const [isOpen, setOpen] = useState(false);
	return (
		<div className="block border-separate bg-background md:hidden">
			<nav className="container flex items-center justify-between px-8">
				<Sheet open={isOpen} onOpenChange={setOpen}>
					<SheetTrigger asChild>
						<Button variant={'ghost'} size={'icon'}>
							<MenuIcon />
						</Button>
					</SheetTrigger>
					<SheetContent className="w-80 sm:w-[540px] space-y-4" side={'left'}>
						<VisuallyHidden>
							<SheetTitle>Menu</SheetTitle>
						</VisuallyHidden>
						<Logo />
						<div className="flex flex-col gap-1">
							<SidebarItems mobile setOpen={setOpen} />
						</div>
					</SheetContent>
				</Sheet>
			</nav>
		</div>
	);
};

export { DesktopSidebar, MobileSidebar };
