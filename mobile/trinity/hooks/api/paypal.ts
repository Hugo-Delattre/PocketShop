// /invoices/{id}/paypal;

// l'id redirige vers la page de paiement paypal
//https:www.sandbox.paypal.com/checkoutnow?token={id}

import { getJwtFromStorage } from "@/hooks/auth";
import { useState } from "react";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL + "/invoices";

export const usePaypalApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const initiatePaypalPayment = async (
    invoiceId: number
  ): Promise<{ paypalUrl: string }> => {
    setLoading(true);
    const token = await getJwtFromStorage();
    if (!token) {
      throw new Error("Authentication required");
    }

    console.log("sending request");

    try {
      console.log("PAYPAL API CALL JWT TOKEN: ", "Bearer" + token);

      const response = await fetch(`${BASE_URL}/${invoiceId}/paypal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to initiate PayPal payment");
      }
      const result = await response.json();
      setResult(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    result,
    loading,
    error,
    initiatePaypalPayment,
  };
};

export default usePaypalApi;
