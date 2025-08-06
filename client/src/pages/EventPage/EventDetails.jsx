import { useParams } from "react-router-dom";
import { Icons } from "../../components/icons/icons";
import { useQuery } from "@tanstack/react-query";
import { eventService } from "../../services/eventService";

async function fetchEventDetails(eventSlug) {
  try {
    const response = await eventService.getEvent(eventSlug);
    return response.data;
  } catch (error) {
    console.error("Error fetching event details:", error);
    throw error;
  }
}

export default function EventDetails() {
  const { eventSlug } = useParams();
  const {
    data: eventDetails,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["eventDetails", eventSlug],
    queryFn: () => fetchEventDetails(eventSlug),
    enabled: !!eventSlug, // Only run the query if eventSlug is available
  });

  if (isLoading) {
    return (
      <div className="text-center text-gray-500">Loading event details...</div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error fetching event details: {error.message}
      </div>
    );
  }

  return (
    <section className="max-w-[80rem] mx-auto my-12 px-4">
      {/* Title & Book Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-pink-900 mb-2">
            {eventDetails.data.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-2">
            <span className="flex items-center gap-2">
              {Icons.Calendar}
              {new Date(eventDetails.data.date).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-2">
              {Icons.Clock}
              {new Date(eventDetails.data.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="flex items-center gap-2">
              {Icons.Location}
              {eventDetails.data.place}
            </span>
          </div>
        </div>
        <button className="w-full md:w-auto px-8 py-3 bg-pink-900 hover:bg-pink-700 text-white font-semibold rounded transition">
          Book Now
        </button>
      </div>

      {/* Image and Description Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <img
          src={eventDetails.data.coverImage.url}
          alt={eventDetails.data.title}
          className="w-full h-80 object-cover rounded-lg"
        />
        <div>
          <p className="text-gray-600 mb-6 text-lg">
            Short description of the event goes here. Highlight what makes this
            event special.
          </p>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            About this event
          </h2>
          <p className="text-gray-700 mb-6">{eventDetails.data.description}</p>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Organizers
            </h3>
            <ul className="space-y-2">
              {eventDetails.data.organizers.map((organizer, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-gray-700 font-medium">
                    {organizer.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
