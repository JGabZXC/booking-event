import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/UI/Loading";
import { paymentService } from "../../../services/paymentService";
import Sort from "../../../components/UI/Sort";
import SortType from "../../../components/UI/SortType";
import Limit from "../../../components/UI/Limit";
import { useSearchParams } from "react-router-dom";
import PageIndicator from "../../../components/UI/PageIndicator";

async function fetchUserTickets(sort = "paymentData", page = 1, limit = 2) {
  try {
    const response = await paymentService.getAllPayments(sort, page, limit);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    throw error;
  }
}

export default function MyTickets() {
  const { user } = useContext(AuthContext);
  const [openPaymentId, setOpenPaymentId] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const handleCardClick = (paymentId) => {
    setOpenPaymentId(openPaymentId === paymentId ? null : paymentId);
  };

  const page = parseInt(searchParams.get("page") || 1);
  const limit = parseInt(searchParams.get("limit") || 10);
  let sort = searchParams.get("sort") || "paymentDate";
  const sortType = searchParams.get("type") || "desc";

  if (sortType === "desc") {
    sort = `-${sort}`;
  }

  const {
    data: userTickets,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["userTickets", user?._id, sort, sortType, page, limit],
    queryFn: () => fetchUserTickets(sort, page, limit),
    enabled: !!user?._id, // Only run the query if user ID is available
  });

  if (page > userTickets?.totalPages) {
    searchParams.set("page", 1);
  }

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage);
    setSearchParams(newParams);
  };

  return (
    <section className="max-w-[80rem] mx-auto my-5 px-2 sm:px-6 lg:px-8">
      <h1 className="text-2xl text-pink-900 font-bold mb-4">My Tickets</h1>

      {isLoading && <Loading message="Loading your tickets" />}

      {error && (
        <div className="text-red-600 text-center">
          <p>
            {error.status}: {""}
            {error?.response?.data?.message ||
              "Something went wrong. Please try again later."}
          </p>
        </div>
      )}

      <div className="max-w-4xl mx-auto my-5 md:my-10 flex flex-col sm:flex-row gap-4">
        <Sort
          sortTypes={[
            { value: "paymentDate", label: "Payment Date" },
            { value: "paymentMethod", label: "Payment Method" },
          ]}
        />
        <SortType
          sortTypes={[
            { value: "asc", label: "Ascending" },
            { value: "desc", label: "Descending" },
          ]}
        />
        <Limit
          limitTypes={[
            { value: "2", label: "2" },
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "30", label: "30" },
            { value: "40", label: "40" },
            { value: "50", label: "50" },
          ]}
        />
      </div>

      {userTickets?.payments && userTickets.payments.length > 0 ? (
        <>
          {userTickets.payments.map((paymentTicket) => (
            <div
              key={paymentTicket._id}
              className="bg-white shadow-md rounded-lg mb-4 p-4 cursor-pointer hover:bg-pink-50 transition border-2 border-pink-50"
              onClick={() => handleCardClick(paymentTicket._id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-md text-pink-800">
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
          ))}

          {/* Pagination Controls */}
          {userTickets.totalPages > 1 && (
            <PageIndicator
              data={userTickets}
              page={page}
              isLoading={isLoading}
              handlePageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center text-gray-600">
          <p>You have no tickets booked.</p>
        </div>
      )}
    </section>
  );
}
