export default function FeatureCard() {
  return (
    <div className="bg-pink-900 p-6 rounded-lg shadow hover:shadow-lg transition">
      <img
        src="https://www.eventbookings.com/wp-content/uploads/2018/03/event-ideas-for-party-eventbookings.jpg"
        alt="Concert"
        className="rounded-md mb-4"
      />
      <h3 className="text-xl font-semibold text-white">Rock Fest 2025</h3>
      <p className="text-sm text-gray-100">June 10 • Manila Arena</p>
      <a href="#" className="text-yellow-500 font-medium mt-2 inline-block">
        Buy Tickets →
      </a>
    </div>
  );
}
