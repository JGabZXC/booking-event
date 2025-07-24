export default function CTA() {
  return (
    <section className="py-20 bg-yellow-500 text-black text-center">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-pink-900">
          Ready to Experience the Show?
        </h2>
        <p className="text-lg mb-8">
          Join thousands of fans who book tickets quickly and securely with
          ShowUp.
        </p>
        <a
          href="#events"
          className=" bg-pink-900 hover:bg-pink-700 text-white px-8 py-3 rounded-full font-semibold transition"
        >
          Browse Events Now
        </a>
      </div>
    </section>
  );
}
