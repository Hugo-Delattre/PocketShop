import { Product } from "@/constants/interface/Product";
import { useState } from "react";

const BASE_URL = "http://localhost:3000"; //TODO:replace by env variable

const useCartApi = () => {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const addToCart = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.ok;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCart = async (userId: string): Promise<Array<Product>> => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/cart/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        return [];
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

  return { data, loading, error, addToCart, getCart };
};
export default useCartApi;
