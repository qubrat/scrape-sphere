'use client';
import { useCallback, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CopyIcon, Loader2 } from 'lucide-react';
import CustomDialogHeader from '@/components/CustomDialogHeader';
import { useForm } from 'react-hook-form';
import { DuplicateWorkflowSchemaType, duplicateWorkflowSchema } from '@/schema/workflow';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { duplicateWorkflow } from '@/actions/workflows/duplicateWorkflow';
import { cn } from '@/lib/utils';

type DuplicateWorkflowDialogProps = {
	workflowId?: string;
	icon?: boolean;
};

function DuplicateWorkflowDialog({ workflowId }: DuplicateWorkflowDialogProps) {
	const [open, setOpen] = useState(false);

	const form = useForm<DuplicateWorkflowSchemaType>({
		resolver: zodResolver(duplicateWorkflowSchema),
		defaultValues: {
			name: '',
			description: '',
			workflowId
		}
	});

	const { mutate, isPending } = useMutation({
		mutationFn: duplicateWorkflow,
		onSuccess: () => {
			toast.success('Workflow duplicated', { id: 'duplicate-workflow' });
			setOpen((prev) => !prev);
		},
		onError: () => {
			toast.error('Failed to duplicate workflow', { id: 'duplicate-workflow' });
		}
	});

	const onSubmit = useCallback((values: DuplicateWorkflowSchemaType) => {
		try {
			toast.loading('Duplicating workflow...', { id: 'duplicate-workflow' });
			mutate(values);
		} catch (error) {
			console.error(error);
		}
	}, []);

	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				form.reset();
				setOpen(open);
			}}
		>
			<DialogTrigger asChild>
				<Button variant={'ghost'} size={'icon'} className={cn('ml-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200')}>
					<CopyIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
				</Button>
			</DialogTrigger>
			<DialogContent className="px-0">
				<CustomDialogHeader icon={CopyIcon} title="Duplicate workflow" />
				<div className="p-6">
					<Form {...form}>
						<form className="space-y-8 w-full" onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex gap-1 items-center">
											Name<p className="text-sx text-primary">(required)</p>
										</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Workflow name" />
										</FormControl>
										<FormDescription>Choose descriptive and unique name</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex gap-1 items-center">
											Description<p className="text-sx text-muted-foreground">(optional)</p>
										</FormLabel>
										<FormControl>
											<Textarea {...field} className="resize-none" placeholder="Workflow description" />
										</FormControl>
										<FormDescription>
											Provide a brief description of what your workflow does. <br /> This is optional but can help you remember
											the workflow&apos;s purpose
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full" disabled={isPending}>
								{!isPending && 'Proceed'}
								{isPending && <Loader2 className="animate-spin" />}
							</Button>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default DuplicateWorkflowDialog;
