import { ExecutionEnvironment } from '@/types/executor';
import { PageToHtmlTask } from '../task/PageToHtml';

export async function PageToHtml(environment: ExecutionEnvironment<typeof PageToHtmlTask>): Promise<boolean> {
	try {
		const websiteUrl = environment.getInput('Web page');
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}
