'use client';
import { cn } from '@/lib/utils';
import { ParamProps } from '@/types/appNode';
import React from 'react';

function BrowserInstanceParam({ param, hasError }: ParamProps) {
	return <p className={cn('text-xs', hasError && 'text-destructive')}>{param.name}</p>;
}

export default BrowserInstanceParam;
