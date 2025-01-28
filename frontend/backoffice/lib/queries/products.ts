import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getProducts,
  ProductType,
  updateProduct,
} from "../repositories/products/productRepository";

export function useGetProducts(queryPagination?: {
  skip?: number;
  take?: number;
}) {
  console.log(queryPagination);

  return useQuery<[ProductType[], number]>({
    queryKey: [
      "getProducts",
      `skip: ${queryPagination?.skip}`,
      `take: ${queryPagination?.take}`,
    ],
    staleTime: 20000,
    queryFn: () => getProducts(queryPagination ?? {}).then((res) => res.data),
  });
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["getProducts"],
        refetchType: "all",
      });
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const mutationObj = useMutation({
    mutationFn: createProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getProducts"] });
    },
  });

  return mutationObj;
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getProducts"] });
    },
  });
};
