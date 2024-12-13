'use client';
import { ParamProps } from '@/types/appNode';
import React, { useId } from 'react';
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { SelectGroup } from '@radix-ui/react-select';
import { cn } from '@/lib/utils';

type OptionType = {
	label: string;
	value: string;
};

function SelectParam({ param, hasError, updateNodeParamValue, value }: ParamProps) {
	const id = useId();
	return (
		<div className="flex flex-col gap-1 w-full">
			<Label htmlFor={id} className={cn('text-xs flex', hasError && 'text-destructive')}>
				{param.name}
				{param.required && <span className="text-red-400 px-1">*</span>}
			</Label>
			<Select onValueChange={(value) => updateNodeParamValue(value)} defaultValue={value}>
				<SelectTrigger className={cn('text-xs', hasError && 'border-destructive')}>
					<SelectValue placeholder="Select an option" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Options</SelectLabel>
						{param.options.map((option: OptionType) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}

export default SelectParam;
