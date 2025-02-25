import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteUser,
  createUser,
  getUsers,
  User,
  getUser,
  updateUser,
} from "../repositories/users/usersRepositories";

export function useGetUsers(queryPagination?: {
  skip?: number;
  take?: number;
}) {
  return useQuery<[User[], number]>({
    queryKey: [
      "getUsers",
      `skip: ${queryPagination?.skip}`,
      `take: ${queryPagination?.take}`,
    ],
    staleTime: 20000,
    queryFn: () => getUsers(queryPagination ?? {}).then((res) => res.data),
  });
}

export function useGetUser(id: number) {
  return useQuery<User>({
    queryKey: ["getUserID"],
    queryFn: () => getUser(id).then((res) => res.data),
  });
}
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  const mutationObj = useMutation({
    mutationFn: createUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getUsers"] });
    },
  });

  return mutationObj;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getUsers"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getUsers"] });
    },
  });
};
