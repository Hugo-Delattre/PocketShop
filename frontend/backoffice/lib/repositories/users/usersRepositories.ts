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
