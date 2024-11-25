import { LaunchBrowserExecutor } from '@/lib/workflow/executor/LaunchBrowserExecutor';
import { PageToHtml } from '@/lib/workflow/executor/PageToHtmlExecutor';
import { ExecutionEnvironment } from '@/types/executor';
import { TaskType } from '@/types/task';
import { WorkflowTaskType } from '@/types/workflow';

type ExecutorFn<T extends WorkflowTaskType> = (environment: ExecutionEnvironment<T>) => Promise<boolean>;

type RegistryType = {
	[K in TaskType]: ExecutorFn<WorkflowTaskType & { type: K }>;
};

export const ExecutorRegistry: RegistryType = {
	LAUNCH_BROWSER: LaunchBrowserExecutor,
	PAGE_TO_HTML: PageToHtml,
	EXTRACT_TEXT_FROM_ELEMENT: () => Promise.resolve(true)
};
