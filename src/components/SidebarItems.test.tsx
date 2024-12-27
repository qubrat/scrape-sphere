import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import SidebarItems from '@/components/SidebarItems';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
	usePathname: jest.fn()
}));

// Mock the next/link component
jest.mock('next/link', () => {
	return ({ children, ...props }: any) => {
		return <a {...props}>{children}</a>;
	};
});

// Mock the buttonVariants function
jest.mock('@/components/ui/button', () => ({
	buttonVariants: jest.fn(() => 'mocked-button-class')
}));

describe('SidebarItems', () => {
	it('renders all route items', () => {
		(usePathname as jest.Mock).mockReturnValue('/');

		render(<SidebarItems />);

		expect(screen.getByText('Home')).toBeInTheDocument();
		expect(screen.getByText('Workflows')).toBeInTheDocument();
		expect(screen.getByText('Credentials')).toBeInTheDocument();
		expect(screen.getByText('Billing')).toBeInTheDocument();
	});

	it('applies correct classes based on active route', () => {
		(usePathname as jest.Mock).mockReturnValue('/workflows');

		render(<SidebarItems />);

		const workflowsLink = screen.getByText('Workflows').closest('a');
		expect(workflowsLink).toHaveClass('mocked-button-class');
	});

	it('calls setOpen when clicked in mobile view', () => {
		(usePathname as jest.Mock).mockReturnValue('/');
		const mockSetOpen = jest.fn();

		render(<SidebarItems mobile setOpen={mockSetOpen} />);

		const homeLink = screen.getByText('Home');
		homeLink.click();

		expect(mockSetOpen).toHaveBeenCalled();
	});

	it('does not call setOpen when clicked in desktop view', () => {
		(usePathname as jest.Mock).mockReturnValue('/');
		const mockSetOpen = jest.fn();

		render(<SidebarItems setOpen={mockSetOpen} />);

		const homeLink = screen.getByText('Home');
		homeLink.click();

		expect(mockSetOpen).not.toHaveBeenCalled();
	});
});
