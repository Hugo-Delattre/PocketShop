import apiClient from "../apiClient";

export type OrderType = {
  id: number;
  total_price: string;
  creation_date: Date;
  payment_date: Date | null;
  is_paid: boolean;
};

export const getOrders = async ({ id }: { id?: string }) => {
  return await apiClient({
    method: "GET",
    url: `/invoices?userId=${id}`,
  });
};
