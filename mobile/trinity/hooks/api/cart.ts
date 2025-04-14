import { useState } from "react";
import { CartResponseDao } from "@/constants/interface/Cart";
import { getJwtFromStorage } from "@/hooks/auth";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL + "/carts";
const INVOICE_URL = process.env.EXPO_PUBLIC_API_URL + "/invoices";
export type AddPayload = {
  productId: string;
  shopId: string;
  userId: string;
};

export type removePayload = {
  userId: number;
  productId: number;
  orderId: number;
  shopId: number;
};

const useCartApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const addToCart = async (body: AddPayload): Promise<boolean> => {
    setLoading(true);
    console.log("addToCart body:", body);
    try {
      const token = await getJwtFromStorage();

      if (!token) {
        throw new Error("No JWT token found");
      }
      console.log("addToCart JWT:", token);

      const response = await fetch(`${BASE_URL}/add`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

  const removeFromCart = async (body: removePayload): Promise<boolean> => {
    setLoading(true);
    try {
      const token = await getJwtFromStorage();

      if (!token) {
        throw new Error("No JWT token found");
      }

      console.log("removeFromCart JWT:", token);
      const response = await fetch(`${BASE_URL}/remove`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
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
    try {
      console.log(`GET ${BASE_URL}/${userId}`);
      const token = await getJwtFromStorage();
      if (!token) {
        setError(new Error("No JWT token found"));
      }
      const response = await fetch(`${BASE_URL}/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("getCart JWT", `Bearer ${token}`);

      if (!response.ok) {
        if (response.status === 401) {
          setError(new Error("Session invalide veuillez vous reconnecter"));
        } else if (response.status === 404) {
          setError(new Error(`Panier vide pour votre utilisateur`));
        } else if (response.status === 500) {
          setError(new Error("Erreur inatendu, veuillez réessayer"));
        }
      }
      const result = await response.json();
      console.log(
        `getCart userId: ${result.userId}, getCard orderId: ${result.orderId}`
      );

      if (!result.products) {
        console.warn("products undefined");
        result.products = [];
      } else {
        const price = await getTotalPriceByCart(result.orderId);
        setError(null);
        result.totalPrice = price;
        return result;
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const getTotalPriceByCart = async (orderId: number): Promise<Number> => {
    setLoading(true);
    try {
      const token = await getJwtFromStorage();
      if (!token) {
        throw new Error("No JWT token found");
      }
      console.log("getTotalPriceByCart JWT:", token);

      const response = await fetch(`${INVOICE_URL}/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
      }
      const result = await response.json();
      return result.total_price;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { loading, error, addToCart, getCart, removeFromCart };
};
export default useCartApi;
