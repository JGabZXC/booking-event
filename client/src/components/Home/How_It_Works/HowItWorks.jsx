import Steps from "./Steps";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 text-gray-800">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          How <span className="text-pink-900">ShowUp</span> Works
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Booking your next concert, theater, or event ticket has never been
          easier.
        </p>

        <div className="grid md:grid-cols-3 gap-10 text-left">
          <Steps
            animUrl="https://lottie.host/d08b1ba7-b4b1-4288-96f8-e42774115162/LfVXAaHMWx.lottie"
            title="1. Discover Event"
            description="Browse through a wide selection of concerts, plays, and live
              events curated just for you."
          />
          <Steps
            animUrl="https://lottie.host/cfe4d93b-5ad5-4d8c-a85b-62ec22a02594/ymvq0EiIiT.lottie"
            title="2. Book Your Tickets"
            description="Choose your seats, pay securely, and receive your e-tickets
              instantly in your inbox."
          />
          <Steps
            animUrl="https://lottie.host/2b1f7110-a432-4b10-a1fc-d12ec86f181f/DcYSBcrouv.lottie"
            title="3. Show Up & Enjoy"
            description="On the day of the event, scan your e-ticket and enjoy the
              experience live."
          />
        </div>
      </div>
    </section>
  );
}
