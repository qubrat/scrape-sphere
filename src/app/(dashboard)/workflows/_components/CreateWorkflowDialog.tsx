'use client';
import React, { useCallback, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, PlusIcon, WorkflowIcon } from 'lucide-react';
import CustomDialogHeader from '@/components/CustomDialogHeader';
import { useForm } from 'react-hook-form';
import { CreateWorkflowSchemaType, createWorkflowSchema } from '@/schema/workflow';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { createWorkflow } from '@/actions/workflows/createWorkflow';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type CreateWorkflowDialogProps = {
	triggerText?: string;
	icon?: boolean;
};

function CreateWorkflowDialog({ triggerText, icon = false }: CreateWorkflowDialogProps) {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const form = useForm<CreateWorkflowSchemaType>({
		resolver: zodResolver(createWorkflowSchema),
		defaultValues: {
			name: '',
			description: ''
		}
	});

	const { mutate, isPending } = useMutation({
		mutationFn: createWorkflow,
		onSuccess: (data) => {
			toast.success('Workflow created', { id: 'create-workflow' });
			if (data.success) {
				router.push(`/workflow/editor/${data.workflowId}`);
			}
		},
		onError: () => {
			toast.error('Failed to create workflow', { id: 'create-workflow' });
		}
	});

	const onSubmit = useCallback((values: CreateWorkflowSchemaType) => {
		try {
			toast.loading('Creating workflow...', { id: 'create-workflow' });
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
				<Button>
					{triggerText ?? 'Create workflow'}
					{icon && <PlusIcon className="w-4 h-4" />}
				</Button>
			</DialogTrigger>
			<DialogContent className="px-0">
				<CustomDialogHeader icon={WorkflowIcon} title="Create workflow" subTitle="Start building your workflow" />
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

export default CreateWorkflowDialog;
