import prisma from '@/lib/prisma';
import { getAppUrl } from '@/lib/utils';
import { WorkflowStatus } from '@/types/workflow';

export async function GET(req: Request) {
	const now = new Date();
	const workflows = await prisma.workflow.findMany({
		select: {
			id: true
		},
		where: {
			status: WorkflowStatus.PUBLISHED,
			cron: {
				not: null
			},
			nextRunAt: {
				lte: now
			}
		}
	});

	for (const workflow of workflows) {
		triggerWorkflow(workflow.id);
	}

	return Response.json({ workflowsToRun: workflows.length }, { status: 200 });
}

function triggerWorkflow(workflowId: string) {
	const triggerApiUrl = getAppUrl(`api/workflows/execute?workflowId=${workflowId}`);

	try {
		fetch(triggerApiUrl, {
			headers: { Authorization: `Bearer ${process.env.API_SECRET!}` },
			cache: 'no-store'
		});
	} catch (error: any) {
		console.error(`Error triggering workflow ${workflowId}:`, ':ERROR->', error.message);
	}
}
