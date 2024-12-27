export const SETTINGS = {
	server: {
		port: process.env.PORT || 3000,
		baseURL: process.env.NEXT_PUBLIC_APP_URL
	},
	brightData: {
		username: process.env.BRIGHT_DATA_USERNAME as string,
		password: process.env.BRIGHT_DATA_PASSWORD as string
	},
	stripe: {
		secret: process.env.STRIPE_SECRET_KEY || 'not-set',
		webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'not-set',
		packs: {
			small: process.env.STRIPE_SMALL_PACK_ID || 'not-set',
			medium: process.env.STRIPE_MEDIUM_PACK_ID || 'not-set',
			large: process.env.STRIPE_LARGE_PACK_ID || 'not-set'
		}
	}
};
