export default function Steps({ icon, title, description }) {
  return (
    <div className="bg-pink-900 p-6 rounded-lg shadow hover:shadow-md transition">
      <div className="text-white text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-200 text-sm">{description}</p>
    </div>
  );
}
