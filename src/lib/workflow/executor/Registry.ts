import { LaunchBrowserExecutor } from '@/lib/workflow/executor/LaunchBrowserExecutor';
import { PageToHtmlExecutor } from '@/lib/workflow/executor/PageToHtmlExecutor';
import { ExtractTextFromHtmlExecutor } from '@/lib/workflow/executor/ExtractTextFromElementExecutor';
import { ExecutionEnvironment } from '@/types/executor';
import { TaskType } from '@/types/task';
import { WorkflowTaskType } from '@/types/workflow';
import { FillInputExecutor } from './FillInputExecutor';
import { ClickElementExecutor } from './ClickElementExecutor';

type ExecutorFn<T extends WorkflowTaskType> = (environment: ExecutionEnvironment<T>) => Promise<boolean>;

type RegistryType = {
	[K in TaskType]: ExecutorFn<WorkflowTaskType & { type: K }>;
};

export const ExecutorRegistry: RegistryType = {
	LAUNCH_BROWSER: LaunchBrowserExecutor,
	PAGE_TO_HTML: PageToHtmlExecutor,
	EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromHtmlExecutor,
	FILL_INPUT: FillInputExecutor,
	CLICK_ELEMENT: ClickElementExecutor
};
