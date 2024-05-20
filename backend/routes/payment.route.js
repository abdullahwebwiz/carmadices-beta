const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// Create a payment intent
router.post('/create-payment-intent', paymentController.createPaymentIntent);

// Handle Stripe webhook events
router.post('/stripe-webhook', paymentController.handleStripeWebhook);

module.exports = router;
