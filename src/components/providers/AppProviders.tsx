'use client';

import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import NextTopLoader from 'nextjs-toploader';
import { COLORS } from '@/lib/colors';

type AppProvidersProps = {
	children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<NextTopLoader color={COLORS.loader} showSpinner={false} />
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				{children}
			</ThemeProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
