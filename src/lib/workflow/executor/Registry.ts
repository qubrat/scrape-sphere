import { LaunchBrowserExecutor } from '@/lib/workflow/executor/LaunchBrowserExecutor';
import { PageToHtmlExecutor } from '@/lib/workflow/executor/PageToHtmlExecutor';
import { ExtractTextFromHtmlExecutor } from '@/lib/workflow/executor/ExtractTextFromElementExecutor';
import { ExecutionEnvironment } from '@/types/executor';
import { TaskType } from '@/types/task';
import { WorkflowTaskType } from '@/types/workflow';
import { FillInputExecutor } from './FillInputExecutor';
import { ClickElementExecutor } from './ClickElementExecutor';
import { WaitForElementExecutor } from './WaitForElementExecutor';
import { DeliverViaWebhookExecutor } from './DeliverViaWebhookExecutor';
import { ExtractDataWithAIExecutor } from './ExtractDataWithAIExecutor';
import { ReadPropertyFromJsonExecutor } from './ReadPropertyFromJsonExecutor';
import { AddPropertyToJsonExecutor } from './AddPropertyToJsonExecutor';
import { NavigateUrlExecutor } from './NavigateUrlExecutor';

type ExecutorFn<T extends WorkflowTaskType> = (environment: ExecutionEnvironment<T>) => Promise<boolean>;

type RegistryType = {
	[K in TaskType]: ExecutorFn<WorkflowTaskType & { type: K }>;
};

export const ExecutorRegistry: RegistryType = {
	LAUNCH_BROWSER: LaunchBrowserExecutor,
	PAGE_TO_HTML: PageToHtmlExecutor,
	EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromHtmlExecutor,
	FILL_INPUT: FillInputExecutor,
	CLICK_ELEMENT: ClickElementExecutor,
	WAIT_FOR_ELEMENT: WaitForElementExecutor,
	DELIVER_VIA_WEBHOOK: DeliverViaWebhookExecutor,
	EXTRACT_DATA_WITH_AI: ExtractDataWithAIExecutor,
	READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonExecutor,
	ADD_PROPERTY_TO_JSON: AddPropertyToJsonExecutor,
	NAVIGATE_URL: NavigateUrlExecutor
};
