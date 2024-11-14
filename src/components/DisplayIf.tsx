import React from 'react';

type DisplayIfProps = {
	children: React.ReactNode;
	condition: boolean;
};

function DisplayIf({ children, condition }: DisplayIfProps) {
	return <>{condition ? children : null}</>;
}

export default DisplayIf;
