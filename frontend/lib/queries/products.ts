import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getProducts,
  ProductType,
  updateProduct,
} from "../repositories/products/productRepository";

export function useGetProducts() {
  return useQuery<ProductType[]>({
    queryKey: ["getProducts"],
    queryFn: () => getProducts().then((res) => res.data),
    staleTime: 20000,
  });
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const mutationObj = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "getProducts" });
    },
  });

  return mutationObj;
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "getProducts" });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "getProducts" });
    },
  });
};
