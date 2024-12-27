import prisma from '@/lib/prisma';
import { executeWorkflow } from '@/lib/workflow/executeWorkflow';
import { TaskRegistry } from '@/lib/workflow/task/Registry';
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowExecutionTrigger } from '@/types/workflow';
import parser from 'cron-parser';
import { timingSafeEqual } from 'crypto';

function isSecretValid(secret: string) {
	const API_SECRET = process.env.API_SECRET;
	if (!API_SECRET) return false;

	try {
		return timingSafeEqual(Buffer.from(API_SECRET), Buffer.from(secret));
	} catch (error) {
		return false;
	}
}

export async function GET(request: Request) {
	const authHeader = request.headers.get('Authorization');

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return Response.json({ error: 'User not authorized' }, { status: 401 });
	}

	const secret = authHeader.split(' ')[1];
	if (!isSecretValid(secret)) {
		return Response.json({ error: 'User not authorized' }, { status: 401 });
	}

	const { searchParams } = new URL(request.url);
	const workflowId = searchParams.get('workflowId') as string;
	if (!workflowId) {
		return Response.json({ error: 'Workflow ID not provided' }, { status: 400 });
	}

	const workflow = await prisma.workflow.findUnique({ where: { id: workflowId } });
	if (!workflow) {
		return Response.json({ error: 'Workflow not found' }, { status: 404 });
	}

	const executionPlan = JSON.parse(workflow.executionPlan!) as WorkflowExecutionPlan;
	if (!executionPlan) {
		return Response.json({ error: 'Execution plan not found' }, { status: 404 });
	}

	try {
		const cron = parser.parseExpression(workflow.cron!, { utc: true });
		const nextRun = cron.next().toDate();
		const execution = await prisma.workflowExecution.create({
			data: {
				workflowId,
				userId: workflow.userId,
				definition: workflow.definition,
				status: WorkflowExecutionStatus.PENDING,
				startedAt: new Date(),
				trigger: WorkflowExecutionTrigger.CRON,
				phases: {
					create: executionPlan.flatMap((phase) => {
						return phase.nodes.flatMap((node) => {
							return {
								userId: workflow.userId,
								status: ExecutionPhaseStatus.CREATED,
								number: phase.phase,
								node: JSON.stringify(node),
								name: TaskRegistry[node.data.type].label
							};
						});
					})
				}
			}
		});

		await executeWorkflow(execution.id, nextRun);
		return Response.json(null, { status: 200 });
	} catch (error) {
		return Response.json({ error: 'Internal server error' }, { status: 500 });
	}
}
