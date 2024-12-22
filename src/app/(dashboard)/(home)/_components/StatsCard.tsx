import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactCountUpWrapper from '@/components/ReactCountUpWrapper';

type StatsCardsProps = {
	title: string;
	value: number;
	icon: LucideIcon;
};

const StatsCard = ({ title, value, icon }: StatsCardsProps) => {
	const Icon = icon;
	return (
		<Card className="relative overflow-hidden h-full">
			<CardHeader className="flex pb-2">
				<CardTitle>{title}</CardTitle>
				<Icon size={120} className="text-muted-foreground absolute -right-8 -bottom-4 stroke-primary opacity-10" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold text-primary">
					<ReactCountUpWrapper value={value} />
				</div>
			</CardContent>
		</Card>
	);
};

export default StatsCard;
