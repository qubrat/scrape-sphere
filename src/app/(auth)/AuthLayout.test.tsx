import { render, screen } from '@testing-library/react';
import AuthLayout from './layout';

describe('AuthLayout', () => {
	it('renders children', () => {
		const children = <div>Test children</div>;
		render(<AuthLayout>{children}</AuthLayout>);

		expect(screen.getByText('Test children')).toBeInTheDocument();
	});
});
