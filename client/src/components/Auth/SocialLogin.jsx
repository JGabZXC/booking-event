export const SocialLogin = ({ onGoogleLogin, onFacebookLogin }) => {
  return (
    <>
      {/* Divider */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={onGoogleLogin}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-200"
        >
          <GoogleIcon className="h-5 w-5" />
          <span className="ml-2">Google</span>
        </button>

        <button
          onClick={onFacebookLogin}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-200"
        >
          <FacebookIcon className="h-5 w-5" />
          <span className="ml-2">Facebook</span>
        </button>
      </div>
    </>
  );
};
