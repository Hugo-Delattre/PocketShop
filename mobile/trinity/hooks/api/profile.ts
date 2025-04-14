import { getProfile, updateProfile, type User } from "@/queries/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetProfile(params?: { onSuccess?: (value: User) => void }) {
  const { onSuccess } = params || {};
  return useQuery<User>({
    queryKey: ["getProfile"],
    staleTime: 5000,
    queryFn: async () => {
      const res = await getProfile();

      if (onSuccess) onSuccess(res?.data as User);
      return res.data;
    },
  });
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getProfile"] });
    },
  });
};
