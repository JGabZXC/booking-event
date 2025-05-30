export default function Hero() {
  return (
    <section className="relative text-white py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.oyorooms.com/blog/wp-content/uploads/2018/02/event.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="relative max-w-4xl mx-auto text-center z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Experience the Moment with{" "}
          <span className="text-pink-900">ShowUp</span>
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Get tickets to concerts, theater shows, and live events — all in one
          place. Don’t just watch, be there!
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="#events"
            className="bg-pink-900 hover:bg-pink-700 text-white px-6 py-3 rounded-full font-semibold transition"
          >
            Browse Events
          </a>
          <a
            href="#how-it-works"
            className="border-2 border-pink-900 px-6 py-3 rounded-full font-semibold hover:bg-pink-900 hover:text-white transition"
          >
            How It Works
          </a>
        </div>
      </div>
    </section>
  );
}
