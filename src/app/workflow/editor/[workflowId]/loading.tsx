import { Loader2Icon } from 'lucide-react';
import React from 'react';

function LoadingEditor() {
	return (
		<div className="flex h-screen w-full items-center justify-center">
			<Loader2Icon size={30} className="stroke-primary animate-spin" />
		</div>
	);
}

export default LoadingEditor;
