import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function ValuePropositionCard({ animUrl, title, description }) {
  return (
    <div className="bg-pink-900 p-6 rounded-lg shadow hover:shadow-md transition">
      {animUrl && (
        <DotLottieReact
          src={animUrl}
          loop
          autoplay
          style={{ width: 120, height: 120, margin: "0 auto" }}
        />
      )}
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-200 text-sm">{description}</p>
    </div>
  );
}
