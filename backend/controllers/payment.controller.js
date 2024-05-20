const stripe = require('stripe')('sk_test_51P1Dr3DuQ2xq97QEKXdez6n47XgxWqxEbeTmf5HM6pvy138q3xgy0xCgEJ8yvBwfoN7qr9UKD3RzapnIN5Z2qHrF00wFbQq1Ov');

// Create a payment intent
const createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Unable to create payment intent' });
    }
};

// Handle Stripe webhook events
const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, 'your_stripe_webhook_secret');
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            // Update payment status in your database from "pending" to "completed"
            console.log('PaymentIntent was successful:', paymentIntent);
            break;
        // Handle other event types as needed
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
};

module.exports = {
    createPaymentIntent,
    handleStripeWebhook,
};
