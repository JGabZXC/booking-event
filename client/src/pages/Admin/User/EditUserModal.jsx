import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ModalDialog from "../../../components/Dialog/ModalDialog";
import { userServiceAdmin } from "../../../services/Admin/User/userServiceAdmin";

export default function EditUserModal({ isOpen, setIsOpen, user }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "user",
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
      });
    }
  }, [user]);

  const handleSaveUser = async (updatedData) => {
    const response = await userServiceAdmin.updateUserDetails(
      user._id,
      updatedData
    );

    if (response.status === "success") {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully!");
      setIsOpen();
    } else {
      toast.error("Failed to update user.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSaveUser(formData);
    setIsOpen(false);
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Edit User"
      buttonName={null}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium text-pink-700 mb-1"
            htmlFor="name"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="w-full rounded-lg border border-pink-300 py-2 px-3 text-pink-900 focus:border-pink-500 focus:ring-pink-500"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-pink-700 mb-1"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full rounded-lg border border-pink-300 py-2 px-3 text-pink-900 focus:border-pink-500 focus:ring-pink-500"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-pink-700 mb-1"
            htmlFor="role"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            className="w-full rounded-lg border border-pink-300 py-2 px-3 text-pink-900 focus:border-pink-500 focus:ring-pink-500"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="organizer">Organizer</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-pink-900 text-white py-3 px-4 rounded-lg hover:bg-pink-800 focus:ring-4 focus:ring-pink-300 font-semibold transition duration-200"
        >
          Save Changes
        </button>
      </form>
    </ModalDialog>
  );
}
