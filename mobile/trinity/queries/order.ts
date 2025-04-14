import apiClient from "./apiClient";

export type GenerateInvoice = {
  filename: string;
  buffer: Buffer;
};

export const generateInvoice = async (orderId: number) => {
  return await apiClient<GenerateInvoice>({
    method: "POST",
    url: `/invoices/generate/${orderId}`,
  });
};

export type PaidOrder = {
  id: number;
  total_price: string;
  creation_date: string;
  payment_date: string;
  is_paid: true;
  paypal_order_id: string;
  paypal_status: string;
};

export const getPaidOrders = async () => {
  return await apiClient<PaidOrder[]>({
    method: "GET",
    url: `/invoices/paid`,
  });
};

export const getOrders = async () => {
  return await apiClient<PaidOrder[]>({
    method: "GET",
    url: `/invoices`,
  });
};
