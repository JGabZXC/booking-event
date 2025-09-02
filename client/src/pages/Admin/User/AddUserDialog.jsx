import { useState } from "react";
import ModalDialog from "../../../components/Dialog/ModalDialog";
import { Icons } from "../../../components/icons/icons";
import Input from "../../../components/UI/Input";
import { isValidEmail } from "../../../utils/emailValidator";
import CustomListBox from "../../../components/UI/CustomListBox";
import { userServiceAdmin } from "../../../services/Admin/User/userServiceAdmin";

const roles = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
  { value: "organizer", label: "Organizer" },
];

async function createUser(userData) {
  try {
    const response = await userServiceAdmin.createUser(userData);
    return response;
  } catch (error) {
    throw error;
  }
}

export default function AddUserDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
    role: "user",
  });

  const btnClass =
    "inline-flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg shadow transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400";

  function handleChange(e) {
    if (e.target === undefined) {
      const { value, label } = e;
      setFormData({
        ...formData,
        role: value,
      });
    } else {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Remove error message when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  }

  function validateForm() {
    const newErrors = {};
    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const newFormData = formData;
      newFormData.name = `${formData.firstName} ${formData.lastName}`;
      const response = await createUser(newFormData);
      console.log(response);
    } catch (err) {
      console.error("Error creating user:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ModalDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Add New User"
      buttonName={
        <span className="flex items-center gap-2">
          {Icons.PlusUserIcon}
          Create User
        </span>
      }
      buttonClassName={btnClass}
    >
      <form onSubmit={handleSubmit} class="space-y-4">
        <Input
          label="First Name"
          svg={Icons.UserIcon}
          id="firstName"
          placeholder="John"
          type="text"
          onChange={handleChange}
          error={errors.firstName}
        />
        <Input
          label="Last Name"
          svg={Icons.UserIcon}
          id="lastName"
          placeholder="Doe"
          type="text"
          onChange={handleChange}
          error={errors.lastName}
        />
        <Input
          label="Email Address"
          svg={Icons.EmailIcon}
          id="email"
          placeholder="john.doe@example.com"
          type="email"
          onChange={handleChange}
          error={errors.email}
        />
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
        <CustomListBox
          types={roles}
          title="Role"
          value={formData.role}
          handleTypesChange={handleChange}
        />
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
    </ModalDialog>
  );
}
