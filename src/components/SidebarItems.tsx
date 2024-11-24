'use client';
import Link from 'next/link';
import { HomeIcon, ShieldCheckIcon, WalletIcon, WorkflowIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';

export type Route = {
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

export default SidebarItems;
