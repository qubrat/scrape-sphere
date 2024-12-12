import TooltipWrapper from '@/components/TooltipWrapper';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

type BackButtonProps = {
	path?: string;
};

const BackButton = ({ path }: BackButtonProps) => {
	const router = useRouter();

	const handleBack = () => {
		if (path) {
			router.push(path);
		} else {
			router.back();
		}
	};

	return (
		<TooltipWrapper content="Back">
			<Button variant={'ghost'} size="icon" onClick={handleBack}>
				<ChevronLeftIcon size={20} />
			</Button>
		</TooltipWrapper>
	);
};

export default BackButton;
