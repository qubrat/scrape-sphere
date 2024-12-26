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
};

export const CreditsPacks: CreditsPack[] = [
	{
		id: CreditsPackId.SMALL,
		name: 'Small Pack',
		label: '1 000 credits',
		price: 699,
		credits: 1000
	},
	{
		id: CreditsPackId.MEDIUM,
		name: 'Medium Pack',
		label: '5 000 credits',
		price: 2499,
		credits: 5000
	},
	{
		id: CreditsPackId.LARGE,
		name: 'Large Pack',
		label: '10 000 credits',
		price: 3999,
		credits: 10000
	}
];

export const getCreditsPack = (id: CreditsPackIdType) => CreditsPacks.find((p) => p.id === id);
