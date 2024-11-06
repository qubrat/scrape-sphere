import { Workflow } from '@prisma/client';
import React from 'react';

type WorkflowCardProps = {
	workflow: Workflow;
};

function WorkflowCard({ workflow }: WorkflowCardProps) {
	return <div>{workflow.name}</div>;
}

export default WorkflowCard;
