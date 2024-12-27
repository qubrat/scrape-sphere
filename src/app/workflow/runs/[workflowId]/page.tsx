import React, { Suspense } from 'react';
import Topbar from '../../_components/topbar/Topbar';
import ExecutionsTableWrapper from './_components/ExecutionsTableWrapper';
import { Loader2Icon } from 'lucide-react';

type ExecutionsPageProps = {
	params: Promise<{ workflowId: string }>;
};

const ExecutionsPage = async ({ params }: ExecutionsPageProps) => {
	const { workflowId } = await params;

	return (
		<div className="h-full w-full overflow-auto">
			<Topbar workflowId={workflowId} title={'All runs'} subtitle={'List of all your workflow runs'} hideButtons path="/workflows" />
			<Suspense
				fallback={
					<div className="flex h-full w-full items-center justify-center">
						<Loader2Icon size={30} className="stroke-primary animate-spin" />
					</div>
				}
			>
				<ExecutionsTableWrapper workflowId={workflowId} />
			</Suspense>
		</div>
	);
};

export default ExecutionsPage;
