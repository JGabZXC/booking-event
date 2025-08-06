import { Await, useLoaderData, useLocation } from "react-router-dom";
import EventCard from "../../components/Event/EventCard";
import { eventService } from "../../services/eventService";
import { Suspense } from "react";
import Loading from "../../components/UI/Loading";
import Sort from "../../components/Event/Sort";
import Genre from "../../components/Event/Genre";
import SortType from "../../components/Event/SortType";
import Limit from "../../components/Event/Limit";

export default function EventPage() {
  const { events } = useLoaderData();
  const location = useLocation();

  return (
    <section className="max-w-[80rem] mx-auto mt-5 px-2 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto my-5 md:my-10 flex flex-col sm:flex-row gap-4">
        <Sort />
        <SortType />
        <Genre />
        <Limit />
      </div>
      <Suspense
        fallback={<Loading message="Loading events" />}
        key={location.search}
      >
        <Await resolve={events}>
          {(resolvedEvents) => (
            <>
              {resolvedEvents.data.data.events.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resolvedEvents.data.data.events.map((event) => (
                    <EventCard
                      key={event._id}
                      eventTitle={event.title}
                      eventDate={new Date(event.date).toLocaleDateString()}
                      eventLocation={event.place}
                      eventImage={event.coverImage?.url}
                      eventDescription={event.description}
                      eventSlug={event.slug}
                      eventStatus={event.status}
                      eventGenre={event.genre}
                    />
                  ))}
                </div>
              )}

              {resolvedEvents.data.data.events.length === 0 && (
                <div className="text-center text-gray-500 h-100">
                  <p className="text-lg">No events found.</p>
                  <p className="text-sm">
                    Try changing the filters or check back later.
                  </p>
                </div>
              )}
            </>
          )}
        </Await>
      </Suspense>
    </section>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ request }) {
  const url = new URL(request.url);
  let sort = url.searchParams.get("sort") || "_id";
  const sortType = url.searchParams.get("type") || "asc";
  const genre = url.searchParams.get("genre") || "all";
  const page = url.searchParams.get("page") || 1;
  const limit = url.searchParams.get("limit") || 10;

  if (sortType !== "asc") sort = `-${sort}`;

  return {
    events: eventService.getAllEvents(sort, page, limit, genre),
  };
}
