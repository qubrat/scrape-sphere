'use client';
import { useCallback, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, PlusIcon, ShieldEllipsisIcon } from 'lucide-react';
import CustomDialogHeader from '@/components/CustomDialogHeader';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createCredentialSchema, CreateCredentialSchemaType } from '@/schema/credential';
import { createCredential } from '@/actions/credentials/createCredential';

type CreateCredentialgProps = {
	triggerText?: string;
	icon?: boolean;
};

function CreateCredentialDialog({ triggerText, icon = false }: CreateCredentialgProps) {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const form = useForm<CreateCredentialSchemaType>({
		resolver: zodResolver(createCredentialSchema),
		defaultValues: {
			name: '',
			value: ''
		}
	});

	const { mutate, isPending } = useMutation({
		mutationFn: createCredential,
		onSuccess: (data) => {
			toast.success('Credential created', { id: 'create-credential' });
			setOpen((prev) => !prev);
		},
		onError: () => {
			toast.error('Failed to create credential', { id: 'create-credential' });
		}
	});

	const onSubmit = useCallback((values: CreateCredentialSchemaType) => {
		try {
			toast.loading('Creating credential...', { id: 'create-credential' });
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
					{triggerText ?? 'Create'}
					{icon && <PlusIcon className="w-4 h-4" />}
				</Button>
			</DialogTrigger>
			<DialogContent className="px-0">
				<CustomDialogHeader icon={ShieldEllipsisIcon} title="Create credential" />
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
											<Input {...field} placeholder="Credential name" />
										</FormControl>
										<FormDescription>
											Enter a unique and descriptive name for your credential
											<br />
											This name will be used to identify the credential
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="value"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex gap-1 items-center">
											Value<p className="text-sx text-primary">(required)</p>
										</FormLabel>
										<FormControl>
											<Textarea {...field} className="resize-none" placeholder="Enter value" />
										</FormControl>
										<FormDescription>
											Enter the value associated with this credential <br />
											This value will be securely encrypted and stored
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

export default CreateCredentialDialog;
