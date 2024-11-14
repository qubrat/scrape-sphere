import { LaunchBrowserTask } from '@/lib/workflow/task/LaunchBrowser';
import { PageToHtmlTask } from './PageToHtml';
import { ExtractTextFromElementTask } from './ExtractTextFromElement';
import { TaskType } from '@/types/task';
import { WorkflowTaskType } from '@/types/workflow';

type RegistryType = {
	[K in TaskType]: WorkflowTaskType & { type: K };
};

export const TaskRegistry: RegistryType = {
	LAUNCH_BROWSER: LaunchBrowserTask,
	PAGE_TO_HTML: PageToHtmlTask,
	EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask
};
