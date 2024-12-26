import { SETTINGS } from '@/config/settings';
import { handleCheckoutSessionCompleted } from '@/lib/stripe/handleCheckoutSessionCompleted';
import { stripe } from '@/lib/stripe/stripe';

export async function POST(request: Request) {
	const body = await request.text();
	const signature = request.headers.get('stripe-signature') as string;

	try {
		const event = stripe.webhooks.constructEvent(body, signature, SETTINGS.stripe.webhookSecret);
		switch (event.type) {
			case 'checkout.session.completed':
				handleCheckoutSessionCompleted(event.data.object);
				break;
			default:
				console.log(`Unhandled event type ${event.type}`);
		}

		return new Response(null, { status: 200 });
	} catch (error) {
		console.error('Stripe webhook error:', error);
		return new Response('Webhook error', { status: 400 });
	}
}
