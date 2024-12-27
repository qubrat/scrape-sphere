'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CoinsIcon, CreditCardIcon, Loader2Icon } from 'lucide-react';
import { CreditsPackId, CreditsPackIdType, CreditsPacks } from '@/types/billing';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { purchaseCredits } from '@/actions/billing/purchaseCredits';
import DisplayIf from '@/components/DisplayIf';

const CreditsPurchase = () => {
	const [selectedPack, setSelectedPack] = useState<CreditsPackIdType>(CreditsPackId.MEDIUM);
	const mutation = useMutation({
		mutationFn: purchaseCredits,
		onSuccess: () => {},
		onError: () => {}
	});

	const handlePackChange = (value: string) => {
		setSelectedPack(value as CreditsPackIdType);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-2xl font-bold flex items-center gap-2">
					<CoinsIcon className="h-6 w-6 text-primary" />
					Purchase Credits
				</CardTitle>
				<CardDescription>Select the amount of credits you want to purchase</CardDescription>
				<CardContent>
					<RadioGroup onValueChange={handlePackChange} value={selectedPack}>
						{CreditsPacks.map((pack) => (
							<div
								className="flex items-center space-x-3 cursor-pointer bg-secondary/50 rounded-lg p-3 hover:bg-secondary transition-all"
								key={pack.id}
								onClick={() => setSelectedPack(pack.id)}
							>
								<RadioGroupItem value={pack.id} id={pack.id} />
								<Label className="flex justify-between w-full cursor-pointer">
									<span className="font-medium">
										{pack.name} - {pack.label}
									</span>
									<span className="font-bold text-primary">${(pack.price / 100).toFixed(2)}</span>
								</Label>
							</div>
						))}
					</RadioGroup>
				</CardContent>
				<CardFooter>
					<Button className="w-full" disabled={mutation.isPending} onClick={() => mutation.mutate(selectedPack)}>
						<DisplayIf condition={!mutation.isPending}>
							<CreditCardIcon className="mr-2 h-5 w-5" />
						</DisplayIf>
						<DisplayIf condition={mutation.isPending}>
							<Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
						</DisplayIf>
						<span>Proceed to payment</span>
					</Button>
				</CardFooter>
			</CardHeader>
		</Card>
	);
};

export default CreditsPurchase;
