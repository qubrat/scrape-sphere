import { ExecutionEnvironment } from '@/types/executor';
import { PageToHtmlTask } from '../task/PageToHtml';

export async function PageToHtmlExecutor(environment: ExecutionEnvironment<typeof PageToHtmlTask>): Promise<boolean> {
	try {
		const html = await environment.getPage()?.content();
		environment.setOutput('HTML', html || '');
		environment.log.info('Successfully converted page to HTML');
		return true;
	} catch (error: any) {
		environment.log.error(error.message);
		return false;
	}
}
