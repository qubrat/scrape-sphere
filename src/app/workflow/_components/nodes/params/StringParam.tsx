'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { ParamProps } from '@/types/appNode';
import React, { useEffect, useId, useState } from 'react';

function StringParam({ param, value, updateNodeParamValue, disabled, hasError }: ParamProps) {
	const [internalValue, setInternalValue] = useState(value || '');
	const id = useId();

	useEffect(() => {
		setInternalValue(value || '');
	}, [value]);

	const InputComponent = param.variant === 'textarea' ? Textarea : Input;

	return (
		<div className="space-y-1 p-1 w-full">
			<Label htmlFor={id} className={cn('text-xs flex', hasError && 'text-destructive')}>
				{param.name}
				{param.required && <span className="text-red-400 px-1">*</span>}
			</Label>
			<InputComponent
				id={id}
				disabled={disabled}
				value={internalValue}
				placeholder="Enter value here"
				onChange={(e) => setInternalValue(e.target.value)}
				onBlur={(e) => updateNodeParamValue(e.target.value)}
				className={cn('text-xs', hasError && 'border-destructive')}
			/>
			{param.helperText && <p className="px-2 text-muted-foreground">{param.helperText}</p>}
		</div>
	);
}

export default StringParam;
