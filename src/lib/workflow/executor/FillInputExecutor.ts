import { ExecutionEnvironment } from '@/types/executor';
import { FillInputTask } from '../task/FillInput';

export async function FillInputExecutor(environment: ExecutionEnvironment<typeof FillInputTask>): Promise<boolean> {
	try {
		const selector = environment.getInput('Selector');
		if (!selector) {
			environment.log.error('input->Selector not defined');
			return false;
		}

		const value = environment.getInput('Value');
		if (!value) {
			environment.log.error('input->Value not defined');
			return false;
		}
		await environment.getPage()?.type(selector, value);
		environment.log.info(`Successfully filled input with selector '${selector}' using value '${value}'`);

		return true;
	} catch (error: any) {
		environment.log.error(error.message);
		return false;
	}
}
