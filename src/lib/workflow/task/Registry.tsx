import { TaskType } from '@/types/task';
import { LaunchBrowserTask } from '@/lib/workflow/task/LaunchBrowser';
import { WorkflowTaskType } from '@/types/workflow';
import { ExtractTextFromElementTask } from './ExtractTextFromElement';
import { FillInputTask } from './FillInput';
import { PageToHtmlTask } from './PageToHtml';
import { ClickElementTask } from './ClickElement';
import { WaitForElementTask } from './WaitForElement';
import { DeliverViaWebhookTask } from './DeliverViaWebhook';
import { ExtractDataWithAITask } from './ExtractDataWithAI';
import { ReadPropertyFromJsonTask } from './ReadPropertyFromJson';
import { AddPropertyToJsonTask } from './AddPropertyToJson';
import { NavigateUrlTask } from './NavigateUrl';

type RegistryType = {
	[K in TaskType]: WorkflowTaskType & { type: K };
};

export const TaskRegistry: RegistryType = {
	LAUNCH_BROWSER: LaunchBrowserTask,
	PAGE_TO_HTML: PageToHtmlTask,
	EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
	FILL_INPUT: FillInputTask,
	CLICK_ELEMENT: ClickElementTask,
	WAIT_FOR_ELEMENT: WaitForElementTask,
	DELIVER_VIA_WEBHOOK: DeliverViaWebhookTask,
	EXTRACT_DATA_WITH_AI: ExtractDataWithAITask,
	READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonTask,
	ADD_PROPERTY_TO_JSON: AddPropertyToJsonTask,
	NAVIGATE_URL: NavigateUrlTask
};
