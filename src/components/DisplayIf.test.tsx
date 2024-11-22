import React from 'react';
import { render } from '@testing-library/react';
import DisplayIf from './DisplayIf';

describe('DisplayIf component', () => {
	it('renders children when condition is true', () => {
		const { getByText } = render(
			<DisplayIf condition={true}>
				<p>Hello World!</p>
			</DisplayIf>
		);
		expect(getByText('Hello World!')).toBeInTheDocument();
	});

	it('does not render children when condition is false', () => {
		const { queryByText } = render(
			<DisplayIf condition={false}>
				<p>Hello World!</p>
			</DisplayIf>
		);
		expect(queryByText('Hello World!')).not.toBeInTheDocument();
	});

	it('updates correctly when condition changes', () => {
		const { queryByText, rerender } = render(
			<DisplayIf condition={false}>
				<p>Hello World!</p>
			</DisplayIf>
		);
		expect(queryByText('Hello World!')).not.toBeInTheDocument();
		rerender(
			<DisplayIf condition={true}>
				<p>Hello World!</p>
			</DisplayIf>
		);
		expect(queryByText('Hello World!')).toBeInTheDocument();
	});
});
