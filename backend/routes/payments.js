const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', async (req, res) => {
  const { price } = req.body; // Price should ideally be calculated on the backend for security

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price * 100, // Stripe expects amounts in cents
      currency: 'inr',
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;