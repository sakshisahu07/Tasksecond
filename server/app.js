const express = require("express");
const Stripe = require("stripe");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const adminRoute = require("./routes/adminRoute");
const productRoute = require("./routes/productRoute");
const paymentRoute = require("./routes/payment");
const userRoute = require("./routes/userRoute");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Stripe
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_51QWwzu02vwTVClLctyYBaf2h73PplOhyG0srtO1ADwGRuwQP06hWgQF9JcC7EWAcjS9mdSj9ANzOuCMV37GM4ULx00y7NPphna");

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use("/adminuser", adminRoute);
app.use("/product", productRoute);
app.use("/users", userRoute);
app.use("/api/payment", paymentRoute);

// MongoDB Connection
mongoose
  .connect(process.env.DBCON, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB!!!"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Stripe Payment Route (Temporary Fix: Payment Route Directly Here for Testing)
app.post("/api/payment", async (req, res) => {
  try {
    const { token, amount } = req.body; // Receive token and amount from client

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: "usd",
      payment_method_types: ["card"],
      description: "Payment for product/service",
      payment_method_data: { type: "card", card: { token } },
      confirm: true, // Auto-confirm payment intent
    });

    res.status(200).json({ success: true, paymentIntent });
  } catch (error) {
    console.error("Payment Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
