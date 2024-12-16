import { ExecutionEnvironment } from '@/types/executor';
import { ScrollToElementTask } from '../task/ScrollToElement';

export async function ScrollToElementExecutor(environment: ExecutionEnvironment<typeof ScrollToElementTask>): Promise<boolean> {
	try {
		const selector = environment.getInput('Selector');
		if (!selector) {
			environment.log.error('Selector not defined');
			return false;
		}

		await environment.getPage()?.evaluate((selector: string) => {
			const element = document.querySelector(selector);
			if (!element) {
				throw new Error(`Element not found with selector ${selector}`);
			}
			const top = element.getBoundingClientRect().top + window.scrollY;
			window.scrollTo({ top: top, behavior: 'smooth' });
		}, selector);
		environment.log.info(`Successfully clicked element with selector '${selector}'`);

		return true;
	} catch (error: any) {
		environment.log.error(error.message);
		return false;
	}
}
