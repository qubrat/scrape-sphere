'use client';
import { getWorkflowExecutions } from '@/actions/workflows/getWorkflowExecutions';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';
import { datesToDurationString } from '@/lib/helper/dates';
import { Badge } from '@/components/ui/badge';
import ExecutionStatusIndicator from './ExecutionStatusIndicator';
import { WorkflowExecutionStatusType } from '@/types/workflow';
import { CoinsIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

type InitialDataType = Awaited<ReturnType<typeof getWorkflowExecutions>>;

type ExecutionsTableProps = {
	workflowId: string;
	initialData: InitialDataType;
};

const ExecutionsTable = ({ workflowId, initialData }: ExecutionsTableProps) => {
	const router = useRouter();
	const query = useQuery({
		queryKey: ['executions', workflowId],
		initialData,
		queryFn: () => getWorkflowExecutions(workflowId),
		refetchInterval: 5000
	});

	return (
		<div className="border rounded-lg shadow-md overflow-auto">
			<Table className="w-full">
				<TableHeader className="bg-muted">
					<TableRow>
						<TableHead>Id</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Consumed</TableHead>
						<TableHead className="text-right text-xs text-muted-foreground">Started at (desc)</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody className="gap-2 h-full overflow-auto">
					{query.data?.map((execution) => {
						const duration = datesToDurationString(execution.completedAt, execution.startedAt);
						const formattedStartedAt = execution.startedAt && formatDistanceToNow(execution.startedAt, { addSuffix: true });
						return (
							<TableRow
								key={execution.id}
								className="cursor-pointer"
								onClick={() => {
									router.push(`/workflow/runs/${workflowId}/${execution.id}`);
								}}
							>
								<TableCell>
									<div className="flex flex-col">
										<span className="font-semibold">{execution.id}</span>
										<div className="text-muted-foreground text-xs flex gap-1 items-center">
											<span>Triggered via</span>
											<Badge variant={'outline'}>{execution.trigger}</Badge>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex flex-col">
										<div className="flex items-center gap-2">
											<ExecutionStatusIndicator status={execution.status as WorkflowExecutionStatusType} />
											<span className="font-semibold capitalize">{execution.status}</span>
										</div>
										<div className="text-muted-foreground text-xs mx-5">{duration}</div>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex flex-col">
										<div className="flex items-center gap-2">
											<CoinsIcon size={16} className="text-primary" />
											<span className="font-semibold capitalize">{execution.creditsConsumed}</span>
										</div>
										<div className="text-muted-foreground text-xs mx-5">Credits</div>
									</div>
								</TableCell>
								<TableCell className="text-right text-muted-foreground">{formattedStartedAt}</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
};

export default ExecutionsTable;