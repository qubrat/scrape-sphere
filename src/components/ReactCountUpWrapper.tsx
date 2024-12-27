'use client';
import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';

type ReactCountUpWrapperProps = {
	value: number | undefined;
};

const ReactCountUpWrapper = ({ value }: ReactCountUpWrapperProps) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return '-';
	}

	return <CountUp duration={0.5} preserveValue end={value ? value : 0} decimals={0} />;
};

export default ReactCountUpWrapper;
