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

export const getUsers = async ({
  skip,
  take,
}: {
  skip?: number;
  take?: number;
}) => {
  return await apiClient({
    method: "get",
    url: `/users?skip=${skip}&take=${take}`,
  });
};
export const getUser = async (id: number) => {
  return await apiClient({
    method: "get",
    url: `/users/${id}`,
  });
};

export const createUser = async (user: User) => {
  return await apiClient({
    method: "post",
    url: `/users`,
    data: user,
  });
};

export const deleteUser = async (id: number) => {
  return await apiClient({
    method: "delete",
    url: `/users/${id}`,
  });
};

export const updateUser = async (user: User) => {
  const { id, ...userToUpdate } = user;

  return await apiClient({
    method: "patch",
    url: `/users/${id}`,
    data: userToUpdate,
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

export type ClientSideUser = Omit<User, "password">;
