import { ExecutionEnvironment } from '@/types/executor';
import { DeliverViaWebhookTask } from '../task/DeliverViaWebhook';

export async function DeliverViaWebhookExecutor(environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>): Promise<boolean> {
	try {
		const targetUrl = environment.getInput('Target URL');
		if (!targetUrl) {
			environment.log.error('Target URL not defined');
			return false;
		}

		const body = environment.getInput('Body');
		if (!body) {
			environment.log.error('Body not defined');
			return false;
		}

		const response = await fetch(targetUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});

		const statusCode = response.status;
		const message = response.statusText;
		environment.setOutput('Status code', statusCode.toString());
		if (statusCode !== 200) {
			environment.log.error(`Failed to deliver via webhook. Status: ${statusCode} - ${message}`);
			return false;
		}
		environment.log.info('Successfully delivered via webhook. Status code: 200 OK');
		return true;
	} catch (error: any) {
		environment.log.error(error.message);
		return false;
	}
}
