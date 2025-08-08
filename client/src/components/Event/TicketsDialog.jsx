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

  let content = null;

  if (isLoading)
    content = (
      <div className="text-center text-gray-500">Loading tickets...</div>
    );

  if (isError)
    content = (
      <div className="text-center text-red-500">
        Error fetching tickets: {error.message}
      </div>
    );

  if (ticketsData?.data.tickets && ticketsData.data.tickets.length > 0) {
    content = (
      <div className="space-y-4">
        {ticketsData.data.tickets.map((ticket) => (
          <div
            key={ticket._id}
            className="p-4 border border-pink-300 rounded shadow-sm"
          >
            <p className="text-white">
              Price:{" "}
              {ticket.price.toLocaleString("en-PH", {
                style: "currency",
                currency: "PHP",
              })}
            </p>
            <p className="text-white">Type: {ticket.type}</p>
            <p className="text-white">
              Available Tickets: {ticket.availableQuantity}
            </p>
          </div>
        ))}
      </div>
    );
  } else if (ticketsData && ticketsData.data.tickets.length === 0) {
    content = (
      <div className="text-center text-gray-500">
        No tickets available for this event.
      </div>
    );
  }

  console.log(ticketsData);

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
