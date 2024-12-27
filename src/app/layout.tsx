import './globals.css';
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import { AppProviders } from '@/components/providers/AppProviders';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';

const font = DM_Sans({ weight: ['400', '500', '600', '700', '800', '900'], subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Scrape Sphere',
	description: 'Get your data from any website'
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider
			afterSignOutUrl={'/sign-in'}
			appearance={{
				elements: {
					formButtonPrimary: 'bg-primary hover:bg-primary/90 text-sm !shadow-none'
				}
			}}
		>
			<html lang="en" suppressHydrationWarning>
				<body className={`${font.className} antialiased`}>
					<AppProviders>{children}</AppProviders>
					<Toaster richColors />
				</body>
			</html>
		</ClerkProvider>
	);
}
