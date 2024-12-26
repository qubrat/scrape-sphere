'use server';

import { CreditsPackIdType } from '@/types/billing';
import { auth } from '@clerk/nextjs/server';

export async function purchaseCredits(packId: CreditsPackIdType) {
	const { userId } = await auth();
	if (!userId) {
		throw new Error('User not authenticated');
	}
}
