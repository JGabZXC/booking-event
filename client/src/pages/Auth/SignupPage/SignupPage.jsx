import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../../../components/Auth/AuthLayout";
import { Icons } from "../../../components/icons/icons";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import Input from "../../../components/Auth/Input";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const { register, isLoading } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Password confirmation validation
    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = "Please confirm your password";
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "Passwords do not match";
    }

    if (!formData.terms) {
      newErrors.terms = "You must agree to the Terms and Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Combine first name and last name into a single name field
      const signupData = {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
      };

      console.log("Signup data:", signupData);
      await register(signupData);
      toast.success("Account created successfully!");
      navigate("/login", { replace: true });
    } catch (error) {
      if (error.errors) {
        return toast.error(error.errors[0], {
          autoClose: 5000,
          pauseOnHover: true,
          draggable: true,
        });
      }
      toast.error(error.message || "An error occurred during signup");
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join ShowUp and never miss an event!"
      bottomText="Already have an account?"
      bottomLink="/login"
      bottomLinkText="Sign in here"
    >
      {" "}
      {/* Signup Form */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name and Last Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <Input
              label="First Name"
              svg={Icons.UserIcon}
              id="firstName"
              placeholder="John"
              type="text"
              onChange={handleChange}
              error={errors.firstName}
            />

            {/* Last Name */}
            <Input
              label="Last Name"
              svg={Icons.UserIcon}
              id="lastName"
              placeholder="Doe"
              type="text"
              onChange={handleChange}
              error={errors.lastName}
            />
          </div>

          {/* Email Field */}
          <div>
            <Input
              label="Email Address"
              svg={Icons.EmailIcon}
              id="email"
              placeholder="john.doe@example.com"
              type="email"
              onChange={handleChange}
              error={errors.email}
            />
          </div>

          {/* Password Field */}
          <Input
            label="Password"
            svg={Icons.PasswordIcon}
            id="password"
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
            error={errors.password}
          >
            {" "}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? Icons.EyeIcon : Icons.EyeCloseIcon}
            </button>
          </Input>

          {/* Password Confirmation Field */}
          <Input
            label="Confirm Password"
            svg={Icons.PasswordIcon}
            id="passwordConfirm"
            placeholder="Confirm your password"
            type={showPasswordConfirm ? "text" : "password"}
            onChange={handleChange}
            error={errors.passwordConfirm}
          >
            {" "}
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswordConfirm ? Icons.EyeIcon : Icons.EyeCloseIcon}
            </button>
          </Input>

          {/* Terms and Conditions */}
          <div>
            <div className="flex items-center">
              <div></div>
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={handleChange}
                // required
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700"
              >
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-pink-600 hover:text-pink-800 font-medium"
                >
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-pink-600 hover:text-pink-800 font-medium"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-900 text-white py-3 px-4 rounded-lg hover:bg-pink-800 focus:ring-4 focus:ring-pink-300 font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                {Icons.LoadingIcon}
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or sign up with
              </span>
            </div>
          </div>
        </div>

        {/* Social Signup */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-200">
            {Icons.GoogleIcon}
            <span className="ml-2">Google</span>
          </button>

          <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-200">
            {Icons.FacebookIcon}
            <span className="ml-2">Facebook</span>
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
