import { useState, useContext, useEffect } from "react";
import ModalDialog from "../Dialog/ModalDialog";
import { eventService } from "../../services/eventService";
import { useQuery } from "@tanstack/react-query";
import TicketsDialogCart from "./TicketsDialogCart";
import { CartContext } from "../../context/CartContext";

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
  const { cartItems } = useContext(CartContext);
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
          eventId: ticket.eventId,
          ticketId: ticket._id,
          type: ticket.type,
          price: ticket.price,
          quantity,
          availableQuantity: ticket.availableQuantity,
        },
      ];
    });
  };

  let content = null;

  useEffect(() => {
    const eventCart = cartItems.filter((item) => item.eventId === eventId);
    if (eventCart.length > 0) setCart(eventCart);
  }, [cartItems, eventId]);

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
            className="p-4 border border-pink-900 rounded shadow-sm flex flex-col md:flex-row md:items-center gap-2 md:gap-4 bg-pink-50"
          >
            <div className="flex-1">
              <p className="text-pink-900 font-bold">
                {ticket.type[0].toUpperCase() + ticket.type.slice(1)}
              </p>
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
              onClick={() => handleAddToCart({ ...ticket, eventId: eventId })}
              className={`bg-pink-900 hover:bg-pink-700 ${
                ticket.availableQuantity < 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              } text-white px-4 py-2 rounded`}
              disabled={ticket.availableQuantity < 1}
            >
              Add
            </button>
          </div>
        ))}

        {/* Cart Preview */}
        {cart.length > 0 && <TicketsDialogCart cart={cart} setCart={setCart} />}
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
