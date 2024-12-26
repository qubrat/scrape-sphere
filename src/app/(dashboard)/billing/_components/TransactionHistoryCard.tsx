import { getUserPurchaseHistory } from '@/actions/billing/getUserPurchaseHistory';
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftRightIcon } from 'lucide-react';
import DisplayIf from '@/components/DisplayIf';
import InvoiceButton from './InvoiceButton';

const TransactionHistoryCard = async () => {
	const purchases = await getUserPurchaseHistory();
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-2xl font-bold flex items-center gap-2">
					<ArrowLeftRightIcon className="h-6 w-6 text-primary" />
					Transaction History
				</CardTitle>
				<CardDescription>View your transaction history and download invoices</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<DisplayIf condition={purchases.length === 0}>
					<p className="text-muted-foreground">No transactions yet</p>
				</DisplayIf>
				<DisplayIf condition={purchases.length > 0}>
					{purchases.map((purchase) => (
						<div key={purchase.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
							<div>
								<p className="font-medium">{formatDate(purchase.date)}</p>
								<p className="text-sm text-muted-foreground">{purchase.description}</p>
							</div>
							<div className="text-right flex items-center justify-center gap-1">
								<p className="font-medium">{formatAmount(purchase.amount, purchase.currency)}</p>
								<InvoiceButton id={purchase.id} />
							</div>
						</div>
					))}
				</DisplayIf>
			</CardContent>
		</Card>
	);
};

export default TransactionHistoryCard;

function formatDate(date: Date) {
	return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
}

function formatAmount(amount: number, currency: string) {
	return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100);
}
