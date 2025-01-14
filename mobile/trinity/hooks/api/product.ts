import { Product } from "@/constants/interface/Product";
import { useState, useCallback } from "react";

const BASE_URL = "http://localhost:3000"; //TODO:replace by env variable

const useProductApi = () => {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const addProduct = async (product: any): Promise<any> => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const getProduct = async (id: string): Promise<Product | null> => {
    setLoading(true);
    const BASE_URL = `https://world.openfoodfacts.org/api/v2/product/${id}.json`;
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        return null;
      }
      const result = await response.json();
      const truncatedResult = JSON.stringify(result.product).substring(0, 600);
      console.log("result", truncatedResult);
      setData(result.product);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (
    id: string,
    product: Product
  ): Promise<any | null> => {
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        return null;
      }
      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
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

  return {
    data,
    loading,
    error,
    addProduct,
    getProduct,
    updateProduct,
    deleteProduct,
  };
};

export default useProductApi;
