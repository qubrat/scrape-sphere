import { ExecutionEnvironment } from '@/types/executor';
import { ExtractDataWithAITask } from '../task/ExtractDataWithAI';

export async function ExtractDataWithAIExecutor(environment: ExecutionEnvironment<typeof ExtractDataWithAITask>): Promise<boolean> {
	try {
		const credentials = environment.getInput('Credentials');
		if (!credentials) {
			environment.log.error('Credentials not defined');
			return false;
		}
		const prompt = environment.getInput('Prompt');
		if (!prompt) {
			environment.log.error('Prompt not defined');
			return false;
		}
		const content = environment.getInput('Content');
		if (!content) {
			environment.log.error('Content not defined');
			return false;
		}

		// TODO
		// Get credentials from DB

		return true;
	} catch (error: any) {
		environment.log.error(error.message);
		return false;
	}
}
