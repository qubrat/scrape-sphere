import { ExecutionEnvironment } from '@/types/executor';
import { ClickElementTask } from '../task/ClickElement';

export async function ClickElementExecutor(environment: ExecutionEnvironment<typeof ClickElementTask>): Promise<boolean> {
	try {
		const selector = environment.getInput('Selector');
		if (!selector) {
			environment.log.error('Selector not defined');
			return false;
		}

		await environment.getPage()?.click(selector);
		environment.log.info(`Successfully clicked element with selector '${selector}'`);

		return true;
	} catch (error: any) {
		environment.log.error(error.message);
		return false;
	}
}
