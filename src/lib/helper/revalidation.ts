import { SETTINGS } from '@/config/settings';

async function triggerRevalidation(path: string) {
	try {
		console.log('Triggering revalidation for path:', path);
		const BASE_URL = SETTINGS.server.baseURL;
		await fetch(`${BASE_URL}/api/revalidate?path=${path}`, {
			method: 'GET',
			cache: 'no-store'
		});
	} catch (error) {
		console.error('Revalidation failed:', error);
	}
}

export default triggerRevalidation;
