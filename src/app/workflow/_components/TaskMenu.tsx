'use client';
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Task, TaskType } from '@/types/task';
import { TaskRegistry } from '@/lib/workflow/task/Registry';
import { Button } from '@/components/ui/button';

function TaskMenu() {
	return (
		<aside className="w-[340px] min-w-[340px] max-w-[340px] border-r-2 border-separate h-full p-2 px-4 overflow-auto">
			<Accordion type="multiple" className="w-full" defaultValue={['interactions', 'extractions', 'timing', 'results', 'storage']}>
				<AccordionItem value="interactions">
					<AccordionTrigger className="font-bold">User interactions</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-1">
						<TaskMenuButton taskType={Task.FILL_INPUT} />
						<TaskMenuButton taskType={Task.CLICK_ELEMENT} />
						<TaskMenuButton taskType={Task.NAVIGATE_URL} />
						<TaskMenuButton taskType={Task.SCROLL_TO_ELEMENT} />
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="extractions">
					<AccordionTrigger className="font-bold">Data extraction</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-1">
						<TaskMenuButton taskType={Task.PAGE_TO_HTML} />
						<TaskMenuButton taskType={Task.EXTRACT_TEXT_FROM_ELEMENT} />
						<TaskMenuButton taskType={Task.EXTRACT_DATA_WITH_AI} />
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="storage">
					<AccordionTrigger className="font-bold">Data storage</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-1">
						<TaskMenuButton taskType={Task.READ_PROPERTY_FROM_JSON} />
						<TaskMenuButton taskType={Task.ADD_PROPERTY_TO_JSON} />
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="timing">
					<AccordionTrigger className="font-bold">Timing controls</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-1">
						<TaskMenuButton taskType={Task.WAIT_FOR_ELEMENT} />
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="results">
					<AccordionTrigger className="font-bold">Result delivery</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-1">
						<TaskMenuButton taskType={Task.DELIVER_VIA_WEBHOOK} />
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
