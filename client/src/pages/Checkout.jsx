import "../pages/Checkout.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Import useNavigate

// Stripe imports
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Load Stripe with your public key
const stripePromise = loadStripe("pk_test_51QWwzu02vwTVClLcZB1WSJoVUn0ouJJrkgxJlhryu8T2Luzb2071a1CF152jTjyVcC9YFH16yYd518q7G4xwGfYV00GccIYdAV");

const CheckoutForm = ({ totalAmount, products }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [input, setInput] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();  // Use navigate for redirection

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Step 1: Create PaymentIntent on the backend
      const { data } = await axios.post("http://localhost:9000/api/payment/orders", {
        amount: totalAmount, // Pass the total amount to backend
      });

      const clientSecret = data.clientSecret;

      // Step 2: Confirm Payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: input.name,
            address: {
              city: input.city,
              line1: input.address,
              postal_code: input.pincode,
            },
          },
        },
      });

      if (result.error) {
        console.error("Payment failed:", result.error.message);
        alert("Payment Failed. Please try again.");
      } else if (result.paymentIntent.status === "succeeded") {
        console.log("Payment succeeded!");

        // Optional: Save order data in your database
        await axios.post("http://localhost:9000/users/usersave", {
          ...input,
          products: products,
          price: totalAmount,
        });

        alert("Payment Successful!");
        
        // Redirect to Thank You page after success
        navigate('/thankyou');
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      navigate('/failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} style={{ width: "90%" }}>
      <h4>Fill Your Shipping Address</h4>
      <Form.Group>
        <Form.Label>Enter Name</Form.Label>
        <Form.Control type="text" name="name" onChange={handleInput} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Enter Address</Form.Label>
        <Form.Control type="text" name="address" onChange={handleInput} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Enter City</Form.Label>
        <Form.Control type="text" name="city" onChange={handleInput} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Enter Pin Code</Form.Label>
        <Form.Control type="text" name="pincode" onChange={handleInput} />
      </Form.Group>

      <Form.Group>
        <Form.Label>Card Details</Form.Label>
        <CardElement />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? "Processing..." : "Pay Now"}
      </Button>
    </Form>
  );
};

const Checkout = () => {
  const myCard = useSelector((state) => state.mycard.card);
  let totalAmount = 0;
  const products = myCard.map((key) => {
    totalAmount += key.price * key.qnty;
    return key.name;
  });

  const tableRows = myCard.map((key, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td><img src={key.image} alt="product" width="100" height="100" /></td>
      <td>{key.name}</td>
      <td>{key.price}</td>
      <td>{key.qnty}</td>
      <td>{key.price * key.qnty}</td>
    </tr>
  ));

  return (
    <div id="payPage">
      <div id="payForm">
        <Elements stripe={stripePromise}>
          <CheckoutForm totalAmount={totalAmount * 100} products={products} />
        </Elements>
      </div>

      <div id="payMethod">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {tableRows}
            <tr>
              <td colSpan="4"></td>
              <td>Net Amount</td>
              <td>{totalAmount}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Checkout;
