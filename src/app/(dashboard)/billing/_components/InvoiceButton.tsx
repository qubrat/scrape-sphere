'use client';
import { downloadInvoice } from '@/actions/billing/downloadInvoice';
import DisplayIf from '@/components/DisplayIf';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { DownloadIcon, Loader2Icon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

type InvoiceButtonProps = {
	id: string;
};

const InvoiceButton = ({ id }: InvoiceButtonProps) => {
	const mutation = useMutation({
		mutationFn: downloadInvoice,
		onSuccess: (url) => (window.location.href = url as string),
		onError: () => toast.error('Something went wrong', { id: 'invoice' })
	});

	return (
		<Button
			onClick={() => mutation.mutate(id)}
			variant={'ghost'}
			size={'sm'}
			className="text-xs gap-2 text-muted-foreground hover:text-primary"
			disabled={mutation.isPending}
		>
			<DisplayIf condition={!mutation.isPending}>
				<DownloadIcon size={8} className="w-4 h-4" />
			</DisplayIf>
			<DisplayIf condition={mutation.isPending}>
				<Loader2Icon size={8} className="w-4 h-4 animate-spin" />
			</DisplayIf>
			Invoice
		</Button>
	);
};

export default InvoiceButton;
