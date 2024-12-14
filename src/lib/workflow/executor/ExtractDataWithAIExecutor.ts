import { ExecutionEnvironment } from '@/types/executor';
import { ExtractDataWithAITask } from '../task/ExtractDataWithAI';
import prisma from '@/lib/prisma';
import { symmetricDecrypt } from '@/lib/encryption';
import OpenAI from 'openai';
import fs from 'fs';
import { extractDataWithAIPrompt } from '@/lib/ai/extractDataWithAIPrompt';

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

		const credential = await prisma.credential.findUnique({
			where: {
				id: credentials
			}
		});
		if (!credential) {
			environment.log.error('Credential not found');
			return false;
		}

		const plainCredential = symmetricDecrypt(credential.value);
		if (!plainCredential) {
			environment.log.error('Failed to decrypt credential');
			return false;
		}

		const openai = new OpenAI({
			apiKey: plainCredential
		});

		const response = await openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'system',
					content: extractDataWithAIPrompt
				},
				{
					role: 'user',
					content: content
				},
				{
					role: 'user',
					content: prompt
				}
			],
			temperature: 1
		});
		environment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`);
		environment.log.info(`Completion tokens: ${response.usage?.completion_tokens}`);

		const result = response.choices[0].message.content;
		if (!result) {
			environment.log.error('Empty response from OpenAI');
			return false;
		}

		environment.setOutput('Extracted data', result);

		return true;
	} catch (error: any) {
		environment.log.error(error.message);
		return false;
	}
}
