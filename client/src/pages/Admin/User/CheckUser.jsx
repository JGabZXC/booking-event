import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/UI/Loading";
import { userServiceAdmin } from "../../../services/Admin/User/userServiceAdmin";
import AddUserDialog from "./AddUserDialog";
import { Icons } from "../../../components/icons/icons";
import Input from "../../../components/UI/Input";
import { useState, useEffect } from "react";
import { MinusCircleIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import EditUserModal from "./EditUserModal";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import DeleteUserModal from "./DeleteUserModal";

function fetchUsers() {
  return userServiceAdmin.getAllUsers("-_id");
}

function fetchUsersBySearch(search) {
  return userServiceAdmin.searchUser(search);
}

function actionUser(identifier, data, action) {
  if (action === "edit") {
    return userServiceAdmin.updateUserDetails(identifier, data);
  } else if (action === "delete") {
    console.log("Not implemented yet");
    return;
  }
}

export default function CheckUser() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", debouncedSearch],
    queryFn: debouncedSearch
      ? () => fetchUsersBySearch(debouncedSearch)
      : fetchUsers,
  });

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleSaveUser = async (updatedData) => {
    const response = await userServiceAdmin.updateUserDetails(
      selectedUser._id,
      updatedData
    );

    if (response.status === "success") {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully!");
    } else {
      toast.error("Failed to update user.");
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteUser = async (user) => {
    console.log("Delete user function called for:", user);

    try {
      await userServiceAdmin.deleteUser(user._id);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully!");
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete user.");
    }
  };

  if (isError) {
    return <div className="text-red-500">Failed to load users.</div>;
  }

  const users = data?.data?.users || data?.data || [];

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gradient-to-br from-white to-pink-50 rounded-xl shadow-lg border border-pink-200 mt-8">
      <EditUserModal
        isOpen={editModalOpen}
        setIsOpen={setEditModalOpen}
        user={selectedUser}
        onSave={handleSaveUser}
      />
      <DeleteUserModal
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        user={selectedUser}
        onDelete={handleDeleteUser}
      />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold text-pink-700 tracking-tight">
          User List
        </h2>
        <AddUserDialog />
      </div>
      <div className="overflow-x-auto rounded-lg">
        <form className="mb-4 flex gap-4 justify-items-center">
          <Input
            id="search-user"
            svg={Icons.SearchIcon}
            placeholder="Search email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {isLoading ? (
          <Loading />
        ) : (
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead>
              <tr className="bg-gradient-to-r from-pink-100 to-pink-200 text-pink-900">
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-6 text-gray-400 font-medium"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr
                    key={user._id}
                    className={`transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-pink-50"
                    } hover:bg-pink-100`}
                  >
                    <td className="py-3 px-4 max-w-[120px] truncate text-xs text-gray-500">
                      {user._id}
                    </td>
                    <td className="py-3 px-4 font-medium">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-pink-100 text-pink-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          className="p-2 cursor-pointer bg-pink-100 hover:bg-pink-200 rounded-lg transition-colors"
                          onClick={() => handleEditClick(user)}
                        >
                          <PencilSquareIcon className="size-4 fill-yellow-500/80" />
                        </button>

                        <button
                          className="p-2 cursor-pointer bg-pink-100 hover:bg-pink-200 rounded-lg transition-colors"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <MinusCircleIcon className="size-4 fill-red-500/80" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
