import { ExecutionEnvironment } from '@/types/executor';
import { ExtractTextFromElementTask } from '../task/ExtractTextFromElement';
import * as cheerio from 'cheerio';

export async function ExtractTextFromHtmlExecutor(environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>): Promise<boolean> {
	try {
		const selector = environment.getInput('Selector');
		if (!selector) {
			console.error('Selector not defined');
			return false;
		}

		const html = environment.getInput('HTML');
		if (!html) {
			console.error('HTML not defined');
			return false;
		}

		const $ = cheerio.load(html);

		const element = $(selector);
		if (!element) {
			console.error('Element not found');
			return false;
		}

		const extractedText = $.text(element);
		if (!extractedText) {
			console.error('Unable to extract text from element');
			return false;
		}

		environment.setOutput('Extracted text', extractedText);

		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}
