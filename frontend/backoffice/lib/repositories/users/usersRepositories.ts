import apiClient from "../apiClient";
import type { postLoginParam } from "./usersRepositories.params";

export const postLogin = async ({ username, password }: postLoginParam) => {
  return await apiClient({
    method: "post",
    url: `/auth/login`,
    data: {
      username,
      password,
    },
  });
};

export const getUsers = async () => {
  return await apiClient({
    method: "get",
    url: `/user`,
  });
};
export const getUser = async (id: number) => {
  return await apiClient({
    method: "get",
    url: `/user/${id}`,
  });
};

export const createUser = async (user: User) => {
  return await apiClient({
    method: "post",
    url: `/user`,
    data: user,
  });
};

export const deleteUser = async (id: number) => {
  return await apiClient({
    method: "delete",
    url: `/user/${id}`,
  });
};

export const updateUser = async (user: User) => {
  return await apiClient({
    method: "patch",
    url: `/user/${user.id}`,
    data: user,
  });
};

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
};
