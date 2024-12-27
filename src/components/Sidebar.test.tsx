import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DesktopSidebar, MobileSidebar } from '@/components/Sidebar';

// Mock the dependencies
jest.mock('@/components/Logo', () => ({
	Logo: () => <div data-testid="mock-logo">Mock Logo</div>
}));

jest.mock('@/components/SidebarItems', () => ({
	__esModule: true,
	default: ({ mobile, setOpen }: { mobile: boolean; setOpen: (open: boolean) => void }) => (
		<div data-testid="mock-sidebar-items" data-mobile={mobile}>
			Mock Sidebar Items
		</div>
	)
}));

// Mock the dependencies
jest.mock('@/components/ui/button', () => ({
	Button: ({ children, ...props }: React.PropsWithChildren<any>) => <button {...props}>{children}</button>
}));

jest.mock('@/components/ui/sheet', () => ({
	Sheet: ({ children, open, onOpenChange }: React.PropsWithChildren<{ open: boolean; onOpenChange: (open: boolean) => void }>) => (
		<div data-testid="mock-sheet" data-open={open}>
			{children}
			<button onClick={() => onOpenChange(!open)}>Toggle</button>
		</div>
	),
	SheetContent: ({ children, ...props }: React.PropsWithChildren<any>) => (
		<div data-testid="mock-sheet-content" {...props}>
			{children}
		</div>
	),
	SheetTrigger: ({ children }: React.PropsWithChildren<{}>) => <div data-testid="mock-sheet-trigger">{children}</div>,
	SheetTitle: ({ children }: React.PropsWithChildren<{}>) => <h2>{children}</h2>
}));

jest.mock('lucide-react', () => ({
	MenuIcon: () => <div data-testid="mock-menu-icon">Mock Menu Icon</div>
}));

describe('DesktopSidebar', () => {
	it('renders correctly', () => {
		render(<DesktopSidebar />);

		// Check if the main container is rendered
		const sidebarContainer = screen.getByTestId('desktop-sidebar');
		expect(sidebarContainer).toBeInTheDocument();
		expect(sidebarContainer).toHaveClass('hidden', 'md:block', 'min-w-[280px]', 'max-w-[280px]');

		// Check if the Logo is rendered
		const logo = screen.getByTestId('mock-logo');
		expect(logo).toBeInTheDocument();

		// Check if the credits section is rendered
		const credits = screen.getByText('TODO CREDITS');
		expect(credits).toBeInTheDocument();

		// Check if SidebarItems are rendered
		const sidebarItems = screen.getByTestId('mock-sidebar-items');
		expect(sidebarItems).toBeInTheDocument();
	});

	it('has the correct styling', () => {
		render(<DesktopSidebar />);

		const sidebarContainer = screen.getByTestId('desktop-sidebar');
		expect(sidebarContainer).toHaveClass('bg-primary/5', 'dark:bg-secondary/30', 'dark:text-foreground', 'text-muted-foreground');
		expect(sidebarContainer).toHaveClass('border-r-2', 'border-separate');
	});
});

describe('MobileSidebar', () => {
	it('renders correctly', () => {
		render(<MobileSidebar />);

		expect(screen.getByTestId('mock-sheet')).toBeInTheDocument();
		expect(screen.getByTestId('mock-sheet-trigger')).toBeInTheDocument();
		expect(screen.getByTestId('mock-menu-icon')).toBeInTheDocument();
		expect(screen.getByTestId('mock-sheet-content')).toBeInTheDocument();
		expect(screen.getByText('Menu')).toBeInTheDocument();
		expect(screen.getByTestId('mock-logo')).toBeInTheDocument();
		expect(screen.getByTestId('mock-sidebar-items')).toBeInTheDocument();
	});

	it('toggles the sheet when button is clicked', () => {
		render(<MobileSidebar />);

		const sheet = screen.getByTestId('mock-sheet');
		expect(sheet).toHaveAttribute('data-open', 'false');

		fireEvent.click(screen.getByText('Toggle'));
		expect(sheet).toHaveAttribute('data-open', 'true');

		fireEvent.click(screen.getByText('Toggle'));
		expect(sheet).toHaveAttribute('data-open', 'false');
	});

	it('renders SidebarItems with correct props and in correct container', () => {
		render(<MobileSidebar />);

		const sidebarItems = screen.getByTestId('mock-sidebar-items');
		expect(sidebarItems).toHaveAttribute('data-mobile', 'true');

		// Check if SidebarItems is within SheetContent
		const sheetContent = screen.getByTestId('mock-sheet-content');
		expect(sheetContent).toContainElement(sidebarItems);

		// Check if there's a div with flex classes containing SidebarItems
		const flexContainer = sidebarItems.closest('div[class*="flex"]');
		expect(flexContainer).not.toBeNull();
		expect(flexContainer).toHaveClass('flex');
		expect(flexContainer).toHaveClass('flex-col');

		// Check if gap-1 is applied (it might be on the same div or a parent)
		const gapContainer = sidebarItems.closest('div[class*="gap-1"]');
		expect(gapContainer).not.toBeNull();
	});
});
