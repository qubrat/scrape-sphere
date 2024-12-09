import { getWorkflowExecutions } from '@/actions/workflows/getWorkflowExecutions';
import { ScrollIcon } from 'lucide-react';
import React from 'react';
import ExecutionsTable from './ExecutionsTable';

type ExecutionsTableProps = {
	workflowId: string;
};

const ExecutionsTableWrapper = async ({ workflowId }: ExecutionsTableProps) => {
	const executions = await getWorkflowExecutions(workflowId);
	if (!executions) {
		return <div>No executions found</div>;
	}

	if (executions.length === 0) {
		return (
			<div className="container w-full py-6">
				<div className="flex flex-col gap-2 items-center justify-center w-full h-full">
					<div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
						<ScrollIcon size={40} className="stroke-primary" />
					</div>
					<div className="flex flex-col gap-1 text-center">
						<p className="font-bold">No runs have been triggered yet for this workflow</p>
						<p className="font-sm text-muted-foreground">You can trigger a new run in the editor page</p>
					</div>
				</div>
			</div>
		);
	}
	return (
		<div className="container w-full py-6">
			<ExecutionsTable workflowId={workflowId} initialData={executions} />
		</div>
	);
};

export default ExecutionsTableWrapper;
