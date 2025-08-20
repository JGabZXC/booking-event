import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
// import { userTicketService } from "../../../services/userTicketService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/UI/Loading";
import { paymentService } from "../../../services/paymentService";

async function fetchUserTickets() {
  try {
    // const response = await userTicketService.getMyTickets();
    const response = await paymentService.getAllPayments();
    return response.data.data;
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

  const [openPaymentId, setOpenPaymentId] = useState(null);

  const handleCardClick = (paymentId) => {
    setOpenPaymentId(openPaymentId === paymentId ? null : paymentId);
  };

  return (
    <section className="max-w-[80rem] mx-auto my-5 px-2 sm:px-6 lg:px-8">
      <h1 className="text-2xl text-pink-900 font-bold mb-4">My Tickets</h1>

      {isLoading && <Loading message="Loading your tickets" />}

      {error && (
        <div className="text-red-600 text-center">
          <p>Something went wrong. Please try again later.</p>
        </div>
      )}

      {userTickets?.payments && userTickets.payments.length > 0 ? (
        userTickets.payments.map((paymentTicket) => (
          <div
            key={paymentTicket._id}
            className="bg-white shadow-md rounded-lg mb-4 p-4 cursor-pointer hover:bg-pink-50 transition"
            onClick={() => handleCardClick(paymentTicket._id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-lg text-pink-800">
                  Payment: {paymentTicket._id}
                </div>
                <div className="text-gray-600 text-sm">
                  Status: {paymentTicket.status}
                </div>
              </div>
              <div>
                <span className="text-pink-700 font-bold">
                  ₱{paymentTicket.amount}
                </span>
              </div>
            </div>
            {openPaymentId === paymentTicket._id && (
              <div className="mt-4 border-t border-t-pink-800 pt-4">
                {Array.isArray(paymentTicket.ticket) ? (
                  paymentTicket.ticket.map((ticketObj, idx) => (
                    <div key={ticketObj._id || idx} className="mb-2">
                      <div className="font-medium text-pink-800">
                        {ticketObj.ticket?.event?.title || "N/A"}
                      </div>
                      <div className="text-gray-700 text-sm">
                        Type: {ticketObj.ticket?.type || "N/A"}
                      </div>
                      <div className="text-gray-700 text-sm">
                        Quantity: {ticketObj.quantity}
                      </div>
                      <div className="text-gray-700 text-sm">
                        Used: {ticketObj.quantityUsed}
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    <div className="font-medium">
                      Ticket:{" "}
                      {paymentTicket.ticket?.ticket?.event?.title || "N/A"}
                    </div>
                    <div className="text-gray-700 text-sm">
                      Type: {paymentTicket.ticket?.ticket?.type || "N/A"}
                    </div>
                    <div className="text-gray-700 text-sm">
                      Quantity: {paymentTicket.ticket?.quantity}
                    </div>
                    <div className="text-gray-700 text-sm">
                      Used: {paymentTicket.ticket?.quantityUsed}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center text-gray-600">
          <p>You have no tickets booked.</p>
        </div>
      )}
    </section>
  );
}
