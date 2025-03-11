import { useEffect, useState } from "react";
import { getJwtFromStorage } from "@/utils/utils";
import { CartResponseDao } from "@/constants/interface/Cart";
const BASE_URL = process.env.EXPO_PUBLIC_API_URL + "/carts";
const INVOICE_URL = process.env.EXPO_PUBLIC_API_URL + "/invoices";
export type AddPayload = {
  productId: string;
  shopId: string;
  userId: string;
};

export type removePayload = {
  productId: number;
  orderId: number;
  shopId: number;
};

const useCartApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  useEffect(() => {
    const retrieveJwtToken = async () => {
      const token = await getJwtFromStorage();
      setJwtToken(token);
    };
    retrieveJwtToken();
  }, []);

  const addToCart = async (body: AddPayload): Promise<boolean> => {
    setLoading(true);
    if (!jwtToken) {
      throw new Error("No JWT token found");
    }
    // console.log("COUCOU", jwtToken);
    try {
      const response = await fetch(`${BASE_URL}/add`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
        body: JSON.stringify(body),
      });
      // console.log("response", response);
      return response.ok;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (body: removePayload): Promise<boolean> => {
    setLoading(true);
    setJwtToken(jwtToken);
    try {
      const response = await fetch(`${BASE_URL}/remove`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
        body: JSON.stringify(body),
      });
      return response.ok;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const getCart = async (userId: number): Promise<CartResponseDao> => {
    setLoading(true);
    setJwtToken(jwtToken);
    try {
      console.log(`GET ${BASE_URL}/${userId}`);
      const response = await fetch(`${BASE_URL}/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      if (!response.ok) {
        console.error("Error while fetching cart:", response.status);
      }
      const result = await response.json();
      console.log("result getCart:", JSON.stringify(result, null, 2));

      if (!result.products) {
        console.warn("products undefined");
        result.products = [];
      }

      const price = await getTotalPriceByCart(result.orderId);
      result.totalPrice = price;
      return result;
    } catch (err) {
      console.error("getCart error:", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const getTotalPriceByCart = async (orderId: number): Promise<Number> => {
    setLoading(true);
    setJwtToken(jwtToken);
    try {
      const response = await fetch(`${INVOICE_URL}/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      if (!response.ok) {
        console.error("Error while fetching cart" + response);
      }
      const result = await response.json();
      return result.total_price;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }
  return { loading, error, addToCart, getCart, removeFromCart };
};
export default useCartApi;
