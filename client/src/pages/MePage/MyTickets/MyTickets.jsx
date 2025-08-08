import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { userTicketService } from "../../../services/userTicketService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/UI/Loading";

async function fetchUserTickets() {
  try {
    const response = await userTicketService.getMyTickets();
    return response.data;
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    throw error;
  }
}

export default function MyTickets() {
  const { user } = useContext(AuthContext);
  const {
    data: userTickets,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["userTickets", user?._id],
    queryFn: fetchUserTickets,
    enabled: !!user?._id, // Only run the query if user ID is available
  });

  console.log(userTickets);

  return (
    <section className="max-w-[80rem] mx-auto my-5 px-2 sm:px-6 lg:px-8">
      <h1 className="text-2xl text-pink-900 font-bold mb-4">My Tickets</h1>

      {isLoading && <Loading message="Loading your tickets" />}

      {error && (
        <div className="text-red-600 text-center">
          <p>Something went wrong. Please try again later.</p>
        </div>
      )}

      {userTickets?.tickets && userTickets.tickets.length > 0 ? (
        <ul className="space-y-4">
          {userTickets.tickets.map((ticket) => (
            <li
              key={ticket._id}
              className="relative p-4 border border-pink-900 rounded-lg shadow-sm overflow-hidden"
            >
              <img
                src={ticket.ticket.event.coverImage.url}
                alt={ticket.ticket.event.title}
                className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-20"
              />
              <div className="relative z-10">
                <h2 className="text-lg text-pink-900 font-semibold">
                  {ticket.ticket.event.title}
                </h2>
                <p className="text-gray-700">
                  Date:{" "}
                  {new Date(ticket.ticket.event.date).toLocaleDateString()}
                </p>
                <p className="text-gray-700">Type: {ticket.ticket.type}</p>
                <p className="text-gray-700">Quantity: {ticket.quantity}</p>
                <p className="text-gray-700">Used: {ticket.quantityUsed}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-600">
          <p>You have no tickets booked.</p>
        </div>
      )}
    </section>
  );
}
