import { setupUser } from '@/actions/billing/setupUser';
import { waitFor } from '@/lib/helper/waitFor';

const SetupPage = async () => {
	await waitFor(1000);
	return await setupUser();
};

export default SetupPage;
