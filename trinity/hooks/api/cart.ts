import { Product, ProductInShop } from "@/constants/interface/Product";
import { useState } from "react";
import getJwt from "@/utils/utils";
import { CartResponseDao } from "@/constants/interface/Cart";
const BASE_URL = process.env.EXPO_PUBLIC_API_URL + "/carts";

type AddPayload = {
  productId: string;
  orderId: string | null | undefined;
  shopId: string;
  userId: string;
};

type removePayload = {
  productId: number;
  orderId: number;
  shopId: number;
};

const useCartApi = () => {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const addToCart = async (body: AddPayload): Promise<boolean> => {
    setLoading(true);
    const jwtToken = await getJwt();
    setJwtToken(jwtToken);
    try {
      const response = await fetch(`${BASE_URL}/add`, {
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

  const removeFromCart = async (body: removePayload): Promise<boolean> => {
    setLoading(true);
    const jwtToken = await getJwt();
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
    const jwtToken = await getJwt();
    setJwtToken(jwtToken);
    try {
      const response = await fetch(`${BASE_URL}/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      if (!response.ok) {
        console.error("Error while fetching cart");
        throw new Error(
          "Error while fetching cart" + " " + response.statusText
        );
      }
      const result = await response.json();
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, addToCart, getCart, removeFromCart };
};
export default useCartApi;
