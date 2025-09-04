import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/UI/Loading";
import { userServiceAdmin } from "../../../services/Admin/User/userServiceAdmin";
import AddUserDialog from "./AddUserDialog";
import { Icons } from "../../../components/icons/icons";
import Input from "../../../components/UI/Input";
import { useState, useEffect } from "react";
function fetchUsers() {
  return userServiceAdmin.getAllUsers("-_id");
}

function fetchUsersBySearch(search) {
  return userServiceAdmin.searchUser(search);
}

export default function CheckUser() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

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

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div className="text-red-500">Failed to load users.</div>;
  }

  const users = data?.data?.users || data?.data || [];

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gradient-to-br from-white to-pink-50 rounded-xl shadow-lg border border-pink-200 mt-8">
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
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead>
            <tr className="bg-gradient-to-r from-pink-100 to-pink-200 text-pink-900">
              <th className="py-3 px-4 font-semibold">ID</th>
              <th className="py-3 px-4 font-semibold">Name</th>
              <th className="py-3 px-4 font-semibold">Email</th>
              <th className="py-3 px-4 font-semibold">Role</th>
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
