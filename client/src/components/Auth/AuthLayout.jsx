import { Link } from "react-router-dom";

export const AuthLayout = ({
  title,
  subtitle,
  children,
  bottomText,
  bottomLink,
  bottomLinkText,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold text-pink-900 mb-2">ShowUp</h1>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">{children}</div>

        {/* Bottom Link */}
        {bottomText && (
          <div className="text-center">
            <p className="text-gray-600">
              {bottomText}{" "}
              <Link
                to={bottomLink}
                className="text-pink-600 hover:text-pink-800 font-medium"
              >
                {bottomLinkText}
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
