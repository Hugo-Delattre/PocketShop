import {
  type GenerateInvoice,
  generateInvoice,
  getOrders,
  getPaidOrders,
  PaidOrder,
} from "@/queries/order";
import { saveFile } from "@/utils/downloadFile";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useGetInvoicePdf(params?: {
  onSuccess?: (value: GenerateInvoice) => void;
}) {
  const { onSuccess } = params || {};
  return useMutation({
    mutationFn: async (orderId: number) => {
      const res = await generateInvoice(orderId);
      console.log(res.data);

      const saveFileRes = await saveFile(res.data);

      if (saveFileRes.success === false) {
        throw new Error(saveFileRes.message);
      }
      if (onSuccess) onSuccess(res.data);
      return res.data;
    },
  });
}

export function useGetPaidOrders(params?: {
  onSuccess?: (value: PaidOrder[]) => void;
}) {
  const { onSuccess } = params || {};
  return useQuery({
    queryKey: ["getPaidOrders"],
    queryFn: async () => {
      const res = await getPaidOrders();

      if (onSuccess) onSuccess(res.data);
      return res.data;
    },
  });
}

export function useGetOrders(params?: {
  onSuccess?: (value: PaidOrder[]) => void;
}) {
  const { onSuccess } = params || {};
  return useQuery({
    queryKey: ["getOrders"],
    queryFn: async () => {
      const res = await getOrders();

      if (onSuccess) onSuccess(res.data);
      return res.data;
    },
  });
}
