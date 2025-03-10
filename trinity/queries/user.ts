import apiClient from "./apiClient";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export type User = {
  id: number;
  creation_date: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: UserRole;
};

export const getProfile = async () => {
  return await apiClient({
    method: "get",
    url: `/profile`,
  });
};

export type UpdateUser = Partial<
  Pick<User, "email" | "first_name" | "last_name" | "username">
>;

export const updateProfile = async (user: UpdateUser) => {
  return await apiClient({
    method: "patch",
    url: `/users/profile`,
    data: user,
  });
};
