'use client';
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Task, TaskType } from '@/types/task';
import { TaskRegistry } from '@/lib/workflow/task/Registry';
import { Button } from '@/components/ui/button';

function TaskMenu() {
	return (
		<aside className="w-[340px] min-w-[340px] max-w-[340px] border-r-2 border-separate h-full p-2 px-4 overflow-auto">
			<Accordion type="multiple" className="w-full" defaultValue={['extractions']}>
				<AccordionItem value="extraction">
					<AccordionTrigger className="font-bold">Data extraction</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-1">
						<TaskMenuButton taskType={Task.PAGE_TO_HTML} />
						<TaskMenuButton taskType={Task.EXTRACT_TEXT_FROM_ELEMENT} />
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</aside>
	);
}

type TaskMenuButtonProps = {
	taskType: TaskType;
};

function TaskMenuButton({ taskType }: TaskMenuButtonProps) {
	const task = TaskRegistry[taskType];

	const handleDragStart = (event: React.DragEvent<HTMLButtonElement>, type: TaskType) => {
		event.dataTransfer.setData('application/reactflow', type);
		event.dataTransfer.effectAllowed = 'move';
	};

	return (
		<Button
			variant={'secondary'}
			className="flex items-center justify-between gap-2 border w-full"
			draggable
			onDragStart={(e) => handleDragStart(e, taskType)}
		>
			<div className="flex gap-2">
				<task.icon size={20} />
				{task.label}
			</div>
		</Button>
	);
}

export default TaskMenu;
