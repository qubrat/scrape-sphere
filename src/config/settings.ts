export const SETTINGS = {
	server: {
		port: process.env.PORT || 3000,
		baseURL: process.env.NEXT_PUBLIC_APP_URL
	},
	brightData: {
		username: process.env.BRIGHT_DATA_USERNAME as string,
		password: process.env.BRIGHT_DATA_PASSWORD as string
	}
};
