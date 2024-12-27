import { getAvailableCredits } from '@/actions/billing/getAvailableCredits';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import ReactCountUpWrapper from '@/components/ReactCountUpWrapper';
import { CoinsIcon } from 'lucide-react';

const BalanceCard = async () => {
	const userBalance = await getAvailableCredits();
	return (
		<Card className="overflow-hidden bg-gradient-to-br from-primary/10 via-primary-5 to-background border-primary/20 shadow-lg flex justify-between flex-col">
			<CardContent className="p-6 relative items-center">
				<div className="flex justify-between items-center">
					<div className="">
						<h3 className="text-lg font-semibold text-foreground mb-1">Available Credits</h3>
						<p className="text-4xl font-bold text-primary">
							<ReactCountUpWrapper value={userBalance} />
						</p>
					</div>
					<CoinsIcon size={140} className="text-primary opacity-20 absolute bottom-0 right-0" />
				</div>
			</CardContent>
			<CardFooter className="text-muted-foreground text-sm">
				When your credits balance reaches zero, your workflows will stop working
			</CardFooter>
		</Card>
	);
};

export default BalanceCard;
