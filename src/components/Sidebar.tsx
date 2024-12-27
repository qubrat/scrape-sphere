'use client';
import { MenuIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/Logo';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import SidebarItems from '@/components/SidebarItems';
import UserAvailableCreditsBadge from '@/components/UserAvailableCreditsBadge';

const DesktopSidebar = () => {
	return (
		<div
			data-testid="desktop-sidebar"
			className="hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate"
		>
			<div className="flex items-center justify-center gap-2 border-b-[1px] border-separate p-4">
				<Logo />
			</div>
			<div className="p-2">
				<UserAvailableCreditsBadge />
			</div>
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
						<UserAvailableCreditsBadge />
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
