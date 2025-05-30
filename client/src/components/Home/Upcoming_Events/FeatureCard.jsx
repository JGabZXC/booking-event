export default function FeatureCard() {
  return (
    <div class="bg-pink-900/80 p-6 rounded-lg shadow hover:shadow-lg transition">
      <img
        src="https://www.eventbookings.com/wp-content/uploads/2018/03/event-ideas-for-party-eventbookings.jpg"
        alt="Concert"
        class="rounded-md mb-4"
      />
      <h3 class="text-xl font-semibold text-white">Rock Fest 2025</h3>
      <p class="text-sm text-gray-200">June 10 • Manila Arena</p>
      <a href="#" class="text-yellow-300 font-medium mt-2 inline-block">
        Buy Tickets →
      </a>
    </div>
  );
}
