import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

export default function TicketsDialogCart({ cart, setCart }) {
  const { addToCart, cartItems } = useContext(CartContext);

  const handleCartQuantityChange = (ticketId, value, max) => {
    const val = Math.max(1, Math.min(Number(value), max));
    setCart((prev) =>
      prev.map((item) =>
        item.ticketId === ticketId ? { ...item, quantity: val } : item
      )
    );
  };

  const handleRemoveFromCart = (ticketId) => {
    setCart((prev) => prev.filter((item) => item.ticketId !== ticketId));
  };

  const addToMainCart = () => {
    addToCart(cart);
  };

  console.log(cartItems);

  return (
    <div className="mt-6 p-4 border border-pink-900 rounded-lg bg-pink-100">
      <h3 className="text-lg font-semibold text-pink-900 mb-2">Cart</h3>
      <ul>
        {cart.map((item) => (
          <li
            key={item.ticketId}
            className="flex items-center justify-between mb-2"
          >
            <span className="text-pink-900 font-medium">
              {item.type[0].toUpperCase() + item.type.slice(1)}
            </span>
            <input
              type="number"
              min={1}
              max={item.availableQuantity}
              value={item.quantity}
              onChange={(e) =>
                handleCartQuantityChange(
                  item.ticketId,
                  e.target.value,
                  item.availableQuantity
                )
              }
              className="w-14 border border-pink-900 rounded px-2 py-1 mx-2 text-pink-900"
            />
            <span className="text-pink-700">₱{item.price * item.quantity}</span>
            <button
              onClick={() => handleRemoveFromCart(item.ticketId)}
              className="ml-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="font-bold mt-2 text-pink-900">
        Total: ₱{cart.reduce((sum, t) => sum + t.price * t.quantity, 0)}
      </div>
      <button
        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        onClick={addToMainCart}
      >
        Add To Cart
      </button>
    </div>
  );
}
