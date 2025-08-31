import { useRouteError } from "react-router-dom";

export default function AwaitErrorPage({ title }) {
  const error = useRouteError();

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow text-center">
      <h1 className="text-2xl font-bold text-pink-800 mb-4">{title}</h1>
      <p className="mb-2 text-gray-700">
        Something went wrong. Please try again later.
      </p>
      <div className="bg-gray-100 rounded p-4 mt-4 text-left overflow-x-auto">
        <pre className="text-xs text-gray-600">
          {error.message || "Try again later"}
        </pre>
      </div>
    </div>
  );
}
