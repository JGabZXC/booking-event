import { useState, useContext } from "react";
import Input from "../../components/UI/Input";
import { Icons } from "../../components/icons/icons";
import { AuthContext } from "../../context/AuthContext";
import PasswordSettings from "./PasswordSettings";
import { UserContext } from "../../context/UserContext";
import { toast } from "react-toastify";

export default function AccountSettings() {
  const { user } = useContext(AuthContext);
  const { updateUser, isLoading: detailsLoading } = useContext(UserContext);
  console.log(user);
  const [form, setForm] = useState({
    firstName: user && user.name.split(" ").slice(0, -1).join(" "),
    lastName: user && user.name.split(" ")[user.name.split(" ").length - 1],
    email: user && user.email,
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};
    if (!form.firstName) {
      errors.firstName = "First name is required";
    }
    if (!form.lastName) {
      errors.lastName = "Last name is required";
    }
    if (!form.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Email is invalid";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage("Please fix the errors before submitting.");
      return;
    }

    form.name = `${form.firstName} ${form.lastName}`;

    try {
      await updateUser(form);
      toast.success("Account settings updated successfully!");
      setMessage("");
      setErrors({});
    } catch (error) {
      setMessage("Failed to update account settings. Please try again.");
      return;
    }
  };

  return (
    <section className="max-w-md mx-auto mt-10 mb-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-pink-900">
        Account Settings
      </h2>
      {message && (
        <div className="mb-4 text-center text-pink-700">{message}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 mb-4">
        <Input
          label="First Name"
          svg={Icons.UserIcon}
          id="firstName"
          type="text"
          placeholder="Enter your first name"
          value={form.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <Input
          label="Last Name"
          svg={Icons.UserIcon}
          id="lastName"
          type="text"
          placeholder="Enter your last name"
          value={form.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
        <Input
          label="Email"
          svg={Icons.EmailIcon}
          id="email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <button
          type="submit"
          className="w-full bg-pink-900 text-white py-3 px-4 rounded-lg hover:bg-pink-800 focus:ring-4 focus:ring-pink-300 font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={detailsLoading}
        >
          {detailsLoading ? Icons.LoadingIcon : "Update Settings"}
        </button>
      </form>
      <PasswordSettings />
    </section>
  );
}
