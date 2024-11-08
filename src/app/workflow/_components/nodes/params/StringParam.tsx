'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StringParamProps } from '@/types/appNode';
import React, { useId, useState } from 'react';

function StringParam({ param, value, updateNodeParamValue }: StringParamProps) {
	const [internalValue, setInternalValue] = useState(value);
	const id = useId();

	return (
		<div className="space-y-1 p-1 w-full">
			<Label htmlFor={id} className="text-xs flex">
				{param.name}
				{param.required && <span className="text-red-400 px-1">*</span>}
			</Label>
			<Input
				id={id}
				value={internalValue}
				placeholder="Enter value here"
				onChange={(e) => setInternalValue(e.target.value)}
				onBlur={(e) => updateNodeParamValue(e.target.value)}
				className="text-xs"
			/>
			{param.helperText && <p className="px-2 text-muted-foreground">{param.helperText}</p>}
		</div>
	);
}

export default StringParam;
