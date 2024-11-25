import { Browser } from 'puppeteer';
import { WorkflowTaskType } from './workflow';

export type Environment = {
	browser?: Browser;
	phases: {
		[key: string]: {
			inputs: Record<string, string>;
			outputs: Record<string, string>;
		};
	};
};

export type ExecutionEnvironment<T extends WorkflowTaskType> = {
	getInput(name: T['inputs'][number]['name']): string;
};
