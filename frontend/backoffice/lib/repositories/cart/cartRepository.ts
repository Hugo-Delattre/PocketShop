import apiClient from "../apiClient";

export type CartType = {
  orderId: number;
  userId: number;
  id: number;
  products: {
    available: boolean;
    availableQuantity: number;
    price: string;
    product: unknown;
    code: string;
    status: string;
    status_verbose: string;
  }[];
  total_price: string;
  creation_date: Date;
  payment_date: Date | null;
  is_paid: false;
};

export const getCart = async ({ userId }: { userId?: number }) => {
  return await apiClient({
    method: "GET",
    url: `/carts/${userId}`,
  });
};
