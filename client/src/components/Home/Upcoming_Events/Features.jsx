import FeatureCard from "./FeatureCard";

export default function Features() {
  return (
    <section className="py-16 bg-white text-gray-800">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4 text-pink-900">
          Upcoming Events
        </h2>
        <p className="text-lg text-gray-600 mb-10">
          Don’t miss these trending concerts, theater shows, and exclusive
          performances.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
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
