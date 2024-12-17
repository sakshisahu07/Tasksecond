require("dotenv").config();
const router = require("express").Router();
const Stripe = require("stripe");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/orders", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid order amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert INR to paise
      currency: "inr",
      payment_method_types: ["card"],
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
