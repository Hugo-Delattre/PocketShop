import { useQuery } from "@tanstack/react-query";
import { OrderType } from "../repositories/order/orderRepository";
import { getOrders } from "../repositories/order/orderRepository";

export function useGetOrders(id: string) {
    return useQuery<OrderType[]>({
        queryKey: ["getOrders"],
        staleTime: 20000,
        queryFn: () => getOrders({ id }).then((res) => res.data),
    });
}
