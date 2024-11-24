import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppProviders } from '@/components/providers/AppProviders';

// Mock the next-themes and @tanstack/react-query modules
jest.mock('next-themes', () => ({
	ThemeProvider: jest.fn(({ children, ...props }) => (
		<div data-testid="theme-provider" data-theme-props={JSON.stringify(props)}>
			{children}
		</div>
	))
}));

jest.mock('@tanstack/react-query', () => ({
	QueryClientProvider: jest.fn(({ children }) => <div data-testid="query-client-provider">{children}</div>),
	QueryClient: jest.fn()
}));

describe('AppProviders', () => {
	it('renders children correctly', () => {
		render(
			<AppProviders>
				<div data-testid="child">Test Child</div>
			</AppProviders>
		);

		expect(screen.getByTestId('child')).toBeInTheDocument();
		expect(screen.getByText('Test Child')).toBeInTheDocument();
	});

	it('provides ThemeProvider with correct props', () => {
		render(<AppProviders>{null}</AppProviders>);
		const themeProvider = screen.getByTestId('theme-provider');
		const themeProps = JSON.parse(themeProvider.getAttribute('data-theme-props') || '{}');

		expect(themeProps.attribute).toBe('class');
		expect(themeProps.defaultTheme).toBe('system');
		expect(themeProps.enableSystem).toBe(true);
	});

	it('provides QueryClientProvider', () => {
		render(<AppProviders>{null}</AppProviders>);

		expect(screen.getByTestId('query-client-provider')).toBeInTheDocument();
	});
});
