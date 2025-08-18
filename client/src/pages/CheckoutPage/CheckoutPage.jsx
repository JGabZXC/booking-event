import { useContext, useMemo, useState, Fragment } from "react";
import { CartContext } from "../../context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { groupByEventId } from "../CartPage/CartPage";
import { useMutation } from "@tanstack/react-query";
import { paymentService } from "../../services/paymentService";

const stripePromise = loadStripe(
  "pk_test_51RqElNBsccdH4nMqJZuMkeEehRQKbMniJk463nl602CTDtmx18Sv0bh4p4diOLgC1T9Qap7pOtBCPKpcWSdIdsrJ0059K7VdCk"
);

const createPaymentIntent = async (tickets) => {
  try {
    const res = await paymentService.createIntent(tickets);
    return res.data;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

function CheckoutForm() {
  const { cartItems } = useContext(CartContext);
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const mutation = useMutation({
    mutationFn: createPaymentIntent,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  // Only include available tickets
  const availableItems = useMemo(
    () => cartItems.filter((item) => item.availableQuantity > 0),
    [cartItems]
  );
  const totalAmount = availableItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const grouped = useMemo(
    () => groupByEventId(availableItems),
    [availableItems]
  );

  if (cartItems.length === 0) {
    return <Navigate to="/me/cart" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { intent } = await mutation.mutateAsync(availableItems);
      const { paymentIntent } = await stripe.confirmCardPayment(
        intent.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      console.log(paymentIntent);

      if (paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");
        const body = {
          tickets: availableItems,
          paymentIntentId: paymentIntent.id,
        };
        await paymentService.confirmPayment(body);
      }
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded shadow"
    >
      <h2 className="text-xl font-bold text-pink-900 mb-4">Checkout</h2>
      <div className="mb-4">
        {Object.entries(grouped).map(([eventId, items], groupIdx, arr) => (
          <div key={eventId} className="mb-4">
            <h3 className="text-lg font-bold text-pink-900 mb-2">
              Event: {eventId}
            </h3>

            <ul>
              {items.map((item, idx) => (
                <li
                  key={item.ticketId ?? idx}
                  className="flex justify-between mb-2"
                >
                  <span className="text-pink-900">
                    {item.type[0].toUpperCase() + item.type.slice(1)} x{" "}
                    {item.quantity}
                  </span>
                  <span className="text-pink-700">
                    ₱{(item.price * item.quantity).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>

            {groupIdx < arr.length - 1 && (
              <div className="border-b border-gray-200 my-4 w-full" />
            )}
          </div>
        ))}
      </div>
      <div className="font-bold mb-4 text-pink-900">
        Total: ₱{totalAmount.toLocaleString()}
      </div>
      <CardElement className="mb-4 p-2 border border-pink-900 rounded" />
      <button
        type="submit"
        disabled={!stripe || loading || availableItems.length === 0}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
      {availableItems.length === 0 && (
        <div className="text-center text-red-600 mt-4">
          No available tickets to checkout.
        </div>
      )}
    </form>
  );
}

export default function CheckoutPage() {
  return (
    <section className="max-w-3xl mx-auto my-10 px-4">
      <h1 className="text-3xl font-bold text-pink-900 mb-6">Checkout</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </section>
  );
}
