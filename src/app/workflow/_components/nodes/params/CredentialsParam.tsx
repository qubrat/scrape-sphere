'use client';
import { ParamProps } from '@/types/appNode';
import React, { useId } from 'react';
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { SelectGroup } from '@radix-ui/react-select';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getCredentialsForUser } from '@/actions/credentials/getCredentialsForUser';

function CredentialsParam({ param, hasError, updateNodeParamValue, value }: ParamProps) {
	const id = useId();
	const query = useQuery({ queryFn: () => getCredentialsForUser(), queryKey: ['credentials-for-user'], refetchInterval: 10 * 1000 });

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
						<SelectLabel>Credentials</SelectLabel>
						{query.data?.map((credential) => (
							<SelectItem key={credential.id} value={credential.id}>
								{credential.name}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}

export default CredentialsParam;
