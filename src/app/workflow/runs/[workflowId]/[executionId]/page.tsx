import { getWorkflowExecutionWithPhases } from '@/actions/workflows/getWorkflowExecutionWithPhases';
import Topbar from '@/app/workflow/_components/topbar/Topbar';
import { Loader2Icon } from 'lucide-react';
import React, { Suspense } from 'react';
import ExecutionViewer from './_components/ExecutionViewer';

type ExecutionViewerPageProps = {
	params: Promise<{ workflowId: string; executionId: string }>;
};

async function ExecutionViewerPage({ params }: ExecutionViewerPageProps) {
	const { workflowId, executionId } = await params;

	return (
		<div className="flex flex-col h-screen w-full overflow-hidden">
			<Topbar workflowId={workflowId} title={'Workflow run details'} subtitle={`Run ID: ${executionId}`} hideButtons />
			<section className="flex h-full overflow-auto">
				<Suspense
					fallback={
						<div className="flex h-full w-full items-center justify-center">
							<Loader2Icon className=" h-10 w-10 stroke-primary animate-spin" size={30} />
						</div>
					}
				>
					<ExecutionViewerWrapper executionId={executionId} />
				</Suspense>
			</section>
		</div>
	);
}

type ExecutionViewerWrapperProps = {
	executionId: string;
};

async function ExecutionViewerWrapper({ executionId }: ExecutionViewerWrapperProps) {
	const workflowExecution = await getWorkflowExecutionWithPhases(executionId);
	if (!workflowExecution) {
		return <div>Workflow run not found</div>;
	}

	return <ExecutionViewer initialData={workflowExecution} />;
}

export default ExecutionViewerPage;
