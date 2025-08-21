import ValuePropositionCard from "./ValuePropositionCard";

export default function ValueProposition() {
  return (
    <section className="py-20 text-gray-800">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Why Choose <span className="text-pink-900">ShowUp</span>?
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          We make it easy and exciting to get tickets to your favorite events.
          Here’s what sets us apart.
        </p>

        <div className="grid md:grid-cols-4 gap-8 text-left">
          <ValuePropositionCard
            animUrl="https://lottie.host/d15bc24c-558b-4a27-9f6e-80bc1e61d243/9DgBMomcjp.lottie"
            title="Instant Tickets"
            description="Receive your e-ticket immediately after purchase — no delays, no printing
      needed."
          />
          <ValuePropositionCard
            animUrl="https://lottie.host/922a5cd6-cf0f-4c4d-9dd3-1864b8407421/MIW5b4Z276.lottie"
            title="Secure Payments"
            description="Your transactions are safe with industry-standard encryption and
              payment options."
          />
          <ValuePropositionCard
            animUrl="https://lottie.host/617e0a52-0d0d-47ea-a38a-33765fc28e44/c2fbQir6gi.lottie"
            title="Verified Events"
            description="Only official and verified event organizers can sell through
              ShowUp."
          />
          <ValuePropositionCard
            animUrl="https://lottie.host/574a9e26-3752-4b1b-b91b-16e4036b18d7/ERgyXxbBta.lottie"
            title="24/7 Support"
            description="Need help? Our friendly team is available anytime to assist you
              before or after your purchase."
          />
        </div>
      </div>
    </section>
  );
}
