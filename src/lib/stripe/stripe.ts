import { SETTINGS } from '@/config/settings';
import Stripe from 'stripe';

export const stripe = new Stripe(SETTINGS.stripe.secret, {
	apiVersion: '2024-12-18.acacia',
	typescript: true
});
