import { useQuery } from "@tanstack/react-query";
import { type CartType, getCart } from "../repositories/cart/cartRepository";

export function useGetCart(userId: number) {
  return useQuery<CartType>({
    queryKey: ["getCart"],
    staleTime: 5000,
    queryFn: () => getCart({ userId }).then((res) => res.data),
  });
}
