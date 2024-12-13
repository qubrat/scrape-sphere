import { getCredentialsForUser } from '@/actions/credentials/getCredentialsForUser';
import { Card } from '@/components/ui/card';
import { LockKeyholeIcon, ShieldOffIcon } from 'lucide-react';
import React from 'react';
import CreateCredentialDialog from './CreateCredentialDialog';
import { formatDistanceToNow } from 'date-fns';
import DeleteCredentialDialog from './DeleteCredentialDialog';

const UserCredentials = async () => {
	const credentials = await getCredentialsForUser();
	if (!credentials) {
		return <div className="">Something went wrong</div>;
	}
	if (credentials.length === 0) {
		return (
			<div className="w-full">
				<div className="flex flex-col gap-4 items-center justify-center">
					<div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
						<ShieldOffIcon size={40} className="stroke-primary" />
					</div>
					<div className="flex flex-col gap-1 text-center">
						<p className="text-bold">No credentials created yet</p>
						<p className="text-sm text-muted-foreground">Click the button below to create your first credential</p>
					</div>
					<CreateCredentialDialog triggerText="Create your first credential" icon />
				</div>
			</div>
		);
	}
	return (
		<div className="flex gap-2 flex-wrap">
			{credentials.map((credential) => {
				const createdAt = formatDistanceToNow(credential.createdAt, { addSuffix: true });

				return (
					<Card key={credential.id} className="w-full p-4 flex justify-between">
						<div className="flex gap-2 items-center">
							<div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center">
								<LockKeyholeIcon size={18} className="stroke-primary" />
							</div>
							<div className="">
								<p className="font-bold">{credential.name}</p>
								<p className="text-xs text-muted-foreground">Created: {createdAt}</p>
							</div>
						</div>
						<DeleteCredentialDialog name={credential.name} />
					</Card>
				);
			})}
		</div>
	);
};

export default UserCredentials;
