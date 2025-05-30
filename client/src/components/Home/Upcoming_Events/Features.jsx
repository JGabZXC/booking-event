import FeatureCard from "./FeatureCard";

export default function Features() {
  return (
    <section class="py-16 bg-white text-gray-800">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4 text-pink-900">Upcoming Events</h2>
        <p class="text-lg text-gray-600 mb-10">
          Don’t miss these trending concerts, theater shows, and exclusive
          performances.
        </p>

        <div class="grid md:grid-cols-3 gap-8">
          <FeatureCard />
          <FeatureCard />
          <FeatureCard />
          <FeatureCard />
          <FeatureCard />
          <FeatureCard />
        </div>
      </div>
    </section>
  );
}
