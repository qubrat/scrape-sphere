'use client';
import { useEffect, useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { CalendarIcon, ClockIcon, Loader2Icon, TriangleAlertIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import CustomDialogHeader from '@/components/CustomDialogHeader';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { updateWorkflowCron } from '@/actions/workflows/updateWorkflowCron';
import { removeWorkflowSchedule } from '@/actions/workflows/removeWorkflowSchedule';
import { toast } from 'sonner';
import DisplayIf from '@/components/DisplayIf';
import cronstrue from 'cronstrue';
import parser from 'cron-parser';
import { Separator } from '@/components/ui/separator';

type SchedulerDialogProps = {
	workflowId: string;
	initialCron: string | null;
};

const SchedulerDialog = ({ workflowId, initialCron }: SchedulerDialogProps) => {
	const [cron, setCron] = useState(initialCron || '');
	const [cronValid, setCronValid] = useState(false);
	const [readableCron, setReadableCron] = useState('');

	const updateScheduleMutation = useMutation({
		mutationFn: updateWorkflowCron,
		onSuccess: () => {
			toast.success('Workflow scheduled', { id: 'cron' });
		},
		onError: () => {
			toast.error('Something went wrong', { id: 'cron' });
		}
	});

	const removeScheduleMutation = useMutation({
		mutationFn: removeWorkflowSchedule,
		onSuccess: () => {
			toast.success('Workflow scheduled', { id: 'cron' });
		},
		onError: () => {
			toast.error('Something went wrong', { id: 'cron' });
		}
	});

	useEffect(() => {
		try {
			parser.parseExpression(cron);
			const humanCronString = cronstrue.toString(cron);
			setCronValid(true);
			setReadableCron(humanCronString);
		} catch (error) {
			setCronValid(false);
		}
	}, [cron]);

	const workflowHasValidCron = initialCron && initialCron.length > 0;
	const readableSaveCron = workflowHasValidCron && cronstrue.toString(initialCron);

	const handleSave = () => {
		toast.loading('Saving...', { id: 'cron' });
		updateScheduleMutation.mutate({ id: workflowId, cron });
	};

	const handleRemove = () => {
		toast.loading('Removing schedule...', { id: 'cron' });
		removeScheduleMutation.mutate(workflowId);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={'link'} size={'sm'} className={cn('text-sm p-0 gap-1 text-orange-500', workflowHasValidCron && 'text-primary')}>
					{workflowHasValidCron ? (
						<div className="flex items-center gap-2">
							<ClockIcon />
							{readableSaveCron}
						</div>
					) : (
						<div className="flex items-center gap-1">
							<TriangleAlertIcon className="w-3 h-3 mr-1" />
							<span>Set schedule</span>
						</div>
					)}
				</Button>
			</DialogTrigger>
			<DialogContent className="px-0 overflow-auto">
				<CustomDialogHeader title="Schedule workflow execution" icon={CalendarIcon} />

				<div className="p-6 space-y-4">
					<p className="text-muted-foreground text-sm">
						Specify a cron expression to schedule periodic workflow execution. All times are in UTC.
					</p>
					<Input placeholder="E.g. * * * * *" value={cron} onChange={(e) => setCron(e.target.value)} />
					<div
						className={cn(
							'border rounded-md p-4 text-sm bg-destructive/5 border-destructive text-destructive',
							cronValid && 'bg-primary/5 text-primary border-primary'
						)}
					>
						{cronValid ? readableCron : 'Invalid cron expression'}
					</div>
					<DisplayIf condition={!!workflowHasValidCron}>
						<DialogClose asChild>
							<div className="">
								<Button
									variant={'outline'}
									className="w-full text-destructive border-destructive hover:text-destructive"
									disabled={removeScheduleMutation.isPending || updateScheduleMutation.isPending}
									onClick={handleRemove}
								>
									<DisplayIf condition={!removeScheduleMutation.isPending}>
										<span>Remove current schedule</span>
									</DisplayIf>
									<DisplayIf condition={removeScheduleMutation.isPending}>
										<Loader2Icon size={16} className="stroke-destructive animate-spin" />
									</DisplayIf>
								</Button>
								<Separator className="my-4" />
							</div>
						</DialogClose>
					</DisplayIf>
				</div>
				<DialogFooter className="px-6 gap-2">
					<DialogClose asChild>
						<Button className="w-full" variant={'secondary'}>
							Cancel
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button className="w-full" onClick={handleSave} disabled={updateScheduleMutation.isPending || !cronValid}>
							<DisplayIf condition={!updateScheduleMutation.isPending}>
								<span>Save</span>
							</DisplayIf>
							<DisplayIf condition={updateScheduleMutation.isPending}>
								<Loader2Icon size={16} className="stroke-primary animate-spin" />
							</DisplayIf>
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default SchedulerDialog;
