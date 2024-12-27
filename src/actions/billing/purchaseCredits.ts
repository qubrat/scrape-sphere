'use server';
import { stripe } from '@/lib/stripe/stripe';
import { getAppUrl } from '@/lib/utils';
import { CreditsPackIdType, getCreditsPack } from '@/types/billing';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function purchaseCredits(packId: CreditsPackIdType) {
	const { userId } = await auth();
	if (!userId) {
		throw new Error('User not authenticated');
	}

	const selectedPack = getCreditsPack(packId);
	if (!selectedPack) {
		throw new Error('Invalid pack id');
	}
	const priceId = selectedPack?.priceId;

	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		invoice_creation: { enabled: true },
		success_url: getAppUrl('billing'),
		cancel_url: getAppUrl('billing'),
		metadata: {
			userId,
			packId
		},
		line_items: [
			{
				quantity: 1,
				price: priceId
			}
		]
	});
	if (!session.url) {
		throw new Error('Failed to create checkout session');
	}

	redirect(session.url);
}
