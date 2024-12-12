import { TaskType } from '@/types/task';
import { LaunchBrowserTask } from '@/lib/workflow/task/LaunchBrowser';
import { WorkflowTaskType } from '@/types/workflow';
import { ExtractTextFromElementTask } from './ExtractTextFromElement';
import { FillInputTask } from './FillInput';
import { PageToHtmlTask } from './PageToHtml';
import { ClickElementTask } from './ClickElement';

type RegistryType = {
	[K in TaskType]: WorkflowTaskType & { type: K };
};

export const TaskRegistry: RegistryType = {
	LAUNCH_BROWSER: LaunchBrowserTask,
	PAGE_TO_HTML: PageToHtmlTask,
	EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
	FILL_INPUT: FillInputTask,
	CLICK_ELEMENT: ClickElementTask
};
