// /invoices/{id}/paypal;

// l'id redirige vers la page de paiement paypal
//https:www.sandbox.paypal.com/checkoutnow?token={id}

import { useState } from "react";
import getJwt from "@/utils/utils";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL + "/invoices";

export const usePaypalApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const initiatePaypalPayment = async (invoiceId: string): Promise<string> => {
    setLoading(true);
    const jwtToken = await getJwt();
    console.log("sending request");

    try {
      const response = await fetch(`${BASE_URL}/${invoiceId}/paypal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to initiate PayPal payment");
      }

        console.log("response.json()", response.json());

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