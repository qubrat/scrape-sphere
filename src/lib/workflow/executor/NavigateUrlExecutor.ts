import { ExecutionEnvironment } from '@/types/executor';
import { ClickElementTask } from '../task/ClickElement';
import { NavigateUrlTask } from '../task/NavigateUrl';

export async function NavigateUrlExecutor(environment: ExecutionEnvironment<typeof NavigateUrlTask>): Promise<boolean> {
	try {
		const url = environment.getInput('URL');
		if (!url) {
			environment.log.error('URL not defined');
			return false;
		}

		await environment.getPage()?.goto(url);
		environment.log.info(`Successfully navigated to ${url}`);

		return true;
	} catch (error: any) {
		environment.log.error(error.message);
		return false;
	}
}
