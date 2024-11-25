import { ExecutionEnvironment } from '@/types/executor';
import puppeteer from 'puppeteer';
import { LaunchBrowserTask } from '../task/LaunchBrowser';

export async function LaunchBrowserExecutor(environment: ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean> {
	try {
		const websiteUrl = environment.getInput('Website URL');

		const browser = await puppeteer.launch({ headless: false }); // false for testing

		await browser.close();
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}
