import { AppNode } from '@/types/appNode';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TaskRegistry } from './workflow/task/Registry';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function calculateWorkflowCost(nodes: AppNode[]) {
	return nodes.reduce((acc, node) => acc + TaskRegistry[node.data.type].credits, 0);
}
