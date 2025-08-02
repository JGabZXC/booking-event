import { useState } from "react";
import Input from "../../components/UI/Input";
import { Icons } from "../../components/icons/icons";

export default function PasswordSettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};
    if (!form.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    if (!form.password) {
      errors.password = "New password is required";
    } else if (form.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (!form.passwordConfirm) {
      errors.passwordConfirm = "Please confirm your new password";
    } else if (form.password !== form.passwordConfirm) {
      errors.passwordConfirm = "Passwords do not match";
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Submit the form
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-4">
      <Input
        label="Current Password"
        svg={Icons.PasswordIcon}
        id="currentPassword"
        placeholder="Enter your current password"
        type={showCurrentPassword ? "text" : "password"}
        onChange={handleChange}
        error={errors.currentPassword}
      >
        {" "}
        <button
          type="button"
          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {showCurrentPassword ? Icons.EyeIcon : Icons.EyeCloseIcon}
        </button>
      </Input>
      <Input
        label="New Password"
        svg={Icons.PasswordIcon}
        id="password"
        placeholder="Enter your new password"
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
          {showCurrentPassword ? Icons.EyeIcon : Icons.EyeCloseIcon}
        </button>
      </Input>
      <Input
        label="Confirm New Password"
        svg={Icons.PasswordIcon}
        id="passwordConfirm"
        placeholder="Confirm your new password"
        type={showPassword ? "text" : "password"}
        onChange={handleChange}
        error={errors.passwordConfirm}
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
      <button
        type="submit"
        className="w-full bg-pink-900 text-white py-3 px-4 rounded-lg hover:bg-pink-800 focus:ring-4 focus:ring-pink-300 font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        Save New Password
      </button>
    </form>
  );
}
