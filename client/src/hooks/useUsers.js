import { useQuery } from "@tanstack/react-query";
import { userServiceAdmin } from "../services/Admin/User/userServiceAdmin";

export const getAllUsers = (sort, page, limit) => {
  return useQuery({
    queryKey: ["users", sort, page, limit],
    queryFn: () => userServiceAdmin.getAllUsers(sort, page, limit),
  });
};

export const searchUsers = (search) => {
  return useQuery({
    queryKey: ["searchUsers", search],
    queryFn: () => userServiceAdmin.searchUser(search),
  });
};
