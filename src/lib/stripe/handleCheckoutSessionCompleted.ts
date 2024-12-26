import { CreditsPackIdType, getCreditsPack } from '@/types/billing';
import 'server-only';
import Stripe from 'stripe';
import prisma from '../prisma';

export async function handleCheckoutSessionCompleted(event: Stripe.Checkout.Session) {
	if (!event.metadata) {
		throw new Error('Missing metadata');
	}
	const { userId, packId } = event.metadata;
	if (!userId) {
		throw new Error('Missing user ID');
	}
	if (!packId) {
		throw new Error('Missing pack ID');
	}

	const purchasedPack = getCreditsPack(packId as CreditsPackIdType);
	if (!purchasedPack) {
		throw new Error('Invalid pack ID');
	}

	await prisma.userBalance.upsert({
		where: {
			userId
		},
		create: {
			userId,
			credits: purchasedPack.credits
		},
		update: {
			credits: {
				increment: purchasedPack.credits
			}
		}
	});
}
