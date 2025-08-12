import { useContext, useEffect } from "react";
import { CartContext } from "../../context/CartContext";
import { ticketService } from "../../services/ticketService";
import { Link } from "react-router-dom";

export function groupByEventId(items) {
  return items.reduce((acc, item) => {
    const key = item.eventName || "unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

export default function CartPage() {
  const {
    cartItems,
    totalAmount,
    removeFromCart,
    clearCart,
    updateCartQuantity,
    updateCartItem,
  } = useContext(CartContext);

  useEffect(() => {
    async function syncCartWithServer() {
      for (const item of cartItems) {
        const latest = await ticketService.getTicket(item.ticketId);
        if (!latest) {
          updateCartItem(item.ticketId, { availableQuantity: 0, quantity: 0 });
        } else {
          let newQuantity = item.quantity;
          if (latest.data.availableQuantity === 0) newQuantity = 0;
          else if (item.quantity > latest.data.availableQuantity)
            newQuantity = latest.data.availableQuantity;

          console.log(newQuantity, latest.data.availableQuantity);
          updateCartItem(item.ticketId, {
            availableQuantity: latest.data.availableQuantity,
            quantity: newQuantity,
          });
        }
      }
    }
    console.log("i got run");
    if (cartItems.length > 0) syncCartWithServer();
    // Only run on mount, not on every cartItems change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(cartItems);

  const grouped = groupByEventId(cartItems);

  return (
    <section className="max-w-3xl mx-auto my-10 px-4">
      <h1 className="text-3xl font-bold text-pink-900 mb-6">Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center text-pink-700">
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <>
          {Object.entries(grouped).map(([eventId, items]) => (
            <div key={eventId} className="mb-8">
              <h2 className="text-xl font-bold text-pink-800 mb-2">
                Event: {eventId}
              </h2>
              <ul className="space-y-4 mb-4">
                {items.map((item, idx) => {
                  const isUnavailable = item.availableQuantity === 0;
                  return (
                    <li
                      key={item.ticketId + idx}
                      className={`flex items-center justify-between p-4 border border-pink-900 rounded-lg shadow ${
                        isUnavailable ? "bg-gray-200 opacity-60" : "bg-pink-50"
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-pink-900">
                          {item.type[0].toUpperCase() + item.type.slice(1)}
                        </div>
                        <div className="text-pink-700">
                          ₱{item.price.toLocaleString()}
                        </div>
                        <div className="text-pink-700 flex items-center gap-2">
                          Quantity:
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            disabled={isUnavailable}
                            onChange={(e) =>
                              updateCartQuantity(item.ticketId, e.target.value)
                            }
                            className={`w-16 border border-pink-900 rounded px-2 py-1 text-pink-900 ${
                              isUnavailable
                                ? "bg-gray-300 cursor-not-allowed"
                                : ""
                            }`}
                          />
                        </div>
                        <div className="text-pink-700">
                          Subtotal: ₱
                          {(item.price * item.quantity).toLocaleString()}
                        </div>
                        {isUnavailable && (
                          <div className="text-xs text-gray-600 mt-2 font-semibold">
                            This ticket is now unavailable
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.ticketId)}
                        className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        Remove
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <div className="flex items-center justify-between mb-6">
            <div className="text-xl font-bold text-pink-900">
              Total: ₱{totalAmount.toLocaleString()}
            </div>
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-pink-900 hover:bg-pink-700 text-white rounded"
            >
              Clear Cart
            </button>
          </div>
          <Link
            to="/checkout"
            className="block text-center w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition"
          >
            Proceed to Checkout
          </Link>
        </>
      )}
    </section>
  );
}
