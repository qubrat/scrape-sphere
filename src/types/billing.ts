import { SETTINGS } from '@/config/settings';

export const CreditsPackId = {
	SMALL: 'SMALL',
	MEDIUM: 'MEDIUM',
	LARGE: 'LARGE'
} as const;

export type CreditsPackIdType = (typeof CreditsPackId)[keyof typeof CreditsPackId];

export type CreditsPack = {
	id: CreditsPackIdType;
	name: string;
	label: string;
	price: number;
	credits: number;
	priceId: string;
};

export const CreditsPacks: CreditsPack[] = [
	{
		id: CreditsPackId.SMALL,
		name: 'Small Pack',
		label: '1 000 credits',
		price: 699,
		credits: 1000,
		priceId: SETTINGS.stripe.packs.small
	},
	{
		id: CreditsPackId.MEDIUM,
		name: 'Medium Pack',
		label: '5 000 credits',
		price: 2499,
		credits: 5000,
		priceId: SETTINGS.stripe.packs.medium
	},
	{
		id: CreditsPackId.LARGE,
		name: 'Large Pack',
		label: '10 000 credits',
		price: 3999,
		credits: 10000,
		priceId: SETTINGS.stripe.packs.large
	}
];

export const getCreditsPack = (id: CreditsPackIdType) => CreditsPacks.find((p) => p.id === id);
