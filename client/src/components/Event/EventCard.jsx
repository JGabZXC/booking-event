import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function EventCard({
  eventTitle,
  eventDate,
  eventLocation,
  eventImage,
  eventDescription,
  eventSlug,
  eventStatus,
  eventGenre,
}) {
  const { user } = useContext(AuthContext);
  let statusClass = "text-sm font-semibold rounded-full px-2 py-1";
  if (eventStatus === "in-progress")
    statusClass += " text-yellow-600 bg-yellow-100";
  else if (eventStatus === "cancelled")
    statusClass += " text-red-600 bg-red-100";
  else if (eventStatus === "completed")
    statusClass += " text-green-600 bg-green-100";
  else if (eventStatus === "coming-soon")
    statusClass += " text-blue-600 bg-blue-100";

  return (
    <div className="max-w-4xl mx-auto my-5 md:my-10 p-2 md:p-6 bg-white rounded-lg shadow-xl border border-pink-200">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-pink-900 mb-2">{eventTitle}</h1>
        <p className="text-gray-600">
          {eventDate} &middot; {eventLocation}
        </p>
        <div className="flex items-center gap-4">
          <div>
            <span className="text-sm font-semibold text-gray-600">Genre:</span>{" "}
            <span className="text-gray-700">
              {eventGenre[0].toUpperCase() + eventGenre.slice(1)}
            </span>
          </div>
          <p className={statusClass}>{eventStatus}</p>
        </div>
      </div>
      <div className="mb-6">
        <img
          src={eventImage}
          alt={eventTitle}
          className="w-full h-100 object-cover rounded"
        />
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-pink-900 mb-2">
          About this event
        </h2>
        <p className="text-gray-700">{eventDescription}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to={user ? `/events/${eventSlug}/buy` : "/login"}
          className="bg-pink-900 text-white px-6 py-3 rounded hover:bg-pink-700 transition font-semibold"
        >
          Buy Tickets
        </Link>
        <Link
          to={`/events/${eventSlug}`}
          className="border border-pink-900 text-pink-900 px-6 py-3 rounded hover:bg-pink-900 hover:text-white transition font-semibold"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
