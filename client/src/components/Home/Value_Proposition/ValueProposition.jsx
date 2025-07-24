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
            icon="🎟️"
            title="Instant Tickets"
            description="Receive your e-ticket immediately after purchase — no delays, no printing
      needed."
          />
          <ValuePropositionCard
            icon="🔒"
            title="Secure Payments"
            description="Your transactions are safe with industry-standard encryption and
              payment options."
          />
          <ValuePropositionCard
            icon="✅"
            title="Verified Events"
            description="Only official and verified event organizers can sell through
              ShowUp."
          />
          <ValuePropositionCard
            icon="🕐"
            title="24/7 Support"
            description="Need help? Our friendly team is available anytime to assist you
              before or after your purchase."
          />
        </div>
      </div>
    </section>
  );
}
