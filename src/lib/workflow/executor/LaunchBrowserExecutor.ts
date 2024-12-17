import { ExecutionEnvironment } from '@/types/executor';
import puppeteer from 'puppeteer';
import { LaunchBrowserTask } from '../task/LaunchBrowser';
import { SETTINGS } from '@/config/settings';

export async function LaunchBrowserExecutor(environment: ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean> {
	try {
		const websiteUrl = environment.getInput('Website URL');

		const browser = await puppeteer.launch({ headless: false, args: ['--proxy-server=brd.superproxy.io:33335'] }); // false for testing
		environment.log.info(`Browser launched successfully`);
		environment.setBrowser(browser);

		const page = await browser.newPage();
		await page.authenticate({ username: SETTINGS.brightData.username, password: SETTINGS.brightData.password });
		await page.goto(websiteUrl);
		environment.setPage(page);
		environment.log.info(`Opened page at ${websiteUrl}`);

		return true;
	} catch (error: any) {
		environment.log.error(error.message);
		return false;
	}
}
