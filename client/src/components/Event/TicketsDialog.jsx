import { useState } from "react";
import ModalDialog from "../Dialog/ModalDialog";
import { eventService } from "../../services/eventService";
import { useQuery } from "@tanstack/react-query";

async function fetchTickets(eventId) {
  try {
    const response = await eventService.getEventTickets(eventId);
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
}

export default function TicketsDialog({ eventId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);

  const {
    data: ticketsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tickets", eventId],
    queryFn: () => fetchTickets(eventId),
    enabled: isOpen && !!eventId,
  });

  const handleQuantityChange = (ticketId, value, max) => {
    const val = Math.max(1, Math.min(Number(value), max));
    setQuantities((prev) => ({
      ...prev,
      [ticketId]: val,
    }));
  };

  const handleAddToCart = (ticket) => {
    const quantity = quantities[ticket._id] || 1;
    setCart((prev) => {
      const exists = prev.find((t) => t.ticketId === ticket._id);
      if (exists) {
        return prev.map((t) =>
          t.ticketId === ticket._id
            ? {
                ...t,
                quantity: Math.min(
                  t.quantity + quantity,
                  ticket.availableQuantity
                ),
              }
            : t
        );
      }
      return [
        ...prev,
        {
          ticketId: ticket._id,
          type: ticket.type,
          price: ticket.price,
          quantity,
          availableQuantity: ticket.availableQuantity,
        },
      ];
    });
  };

  // Update quantity directly in cart
  const handleCartQuantityChange = (ticketId, value, max) => {
    const val = Math.max(1, Math.min(Number(value), max));
    setCart((prev) =>
      prev.map((item) =>
        item.ticketId === ticketId ? { ...item, quantity: val } : item
      )
    );
  };

  // Remove from cart
  const handleRemoveFromCart = (ticketId) => {
    setCart((prev) => prev.filter((item) => item.ticketId !== ticketId));
  };

  let content = null;

  if (isLoading)
    content = (
      <div className="text-center text-pink-900">Loading tickets...</div>
    );

  if (isError)
    content = (
      <div className="text-center text-red-600">
        Error fetching tickets: {error.message}
      </div>
    );

  if (ticketsData?.data.tickets && ticketsData.data.tickets.length > 0) {
    content = (
      <div className="space-y-4">
        {ticketsData.data.tickets.map((ticket) => (
          <div
            key={ticket._id}
            className="p-4 border border-pink-900 rounded shadow-sm flex flex-col md:flex-row md:items-center md:gap-4 bg-pink-50"
          >
            <div className="flex-1">
              <p className="text-pink-900 font-bold">{ticket.type}</p>
              <p className="text-pink-700">
                Price:{" "}
                {ticket.price.toLocaleString("en-PH", {
                  style: "currency",
                  currency: "PHP",
                })}
              </p>
              <p className="text-pink-700">
                Available: {ticket.availableQuantity}
              </p>
            </div>
            <input
              type="number"
              min={1}
              max={ticket.availableQuantity}
              value={quantities[ticket._id] || 1}
              onChange={(e) =>
                handleQuantityChange(
                  ticket._id,
                  e.target.value,
                  ticket.availableQuantity
                )
              }
              className="w-16 border border-pink-900 rounded px-2 py-1 mr-2 text-pink-900"
            />
            <button
              onClick={() => handleAddToCart(ticket)}
              className="bg-pink-900 hover:bg-pink-700 text-white px-4 py-2 rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}

        {/* Cart Preview */}
        {cart.length > 0 && (
          <div className="mt-6 p-4 border border-pink-900 rounded-lg bg-pink-100">
            <h3 className="text-lg font-semibold text-pink-900 mb-2">Cart</h3>
            <ul>
              {cart.map((item) => (
                <li
                  key={item.ticketId}
                  className="flex items-center justify-between mb-2"
                >
                  <span className="text-pink-900 font-medium">{item.type}</span>
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
                  <span className="text-pink-700">
                    ₱{item.price * item.quantity}
                  </span>
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
              onClick={() => alert("Add to Cart")}
            >
              Add To Cart
            </button>
          </div>
        )}
      </div>
    );
  } else if (ticketsData && ticketsData.data.tickets.length === 0) {
    content = (
      <div className="text-center text-pink-900">
        No tickets available for this event.
      </div>
    );
  }

  return (
    <ModalDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Buy Tickets"
      buttonName="Buy Tickets"
      buttonClassName="w-full md:w-auto px-8 py-3 bg-pink-900 hover:bg-pink-700 text-white font-semibold rounded transition"
    >
      {content}
    </ModalDialog>
  );
}
