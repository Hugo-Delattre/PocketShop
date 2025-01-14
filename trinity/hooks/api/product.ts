import { Product } from "@/constants/interface/Product";
import { useState, useCallback, useEffect } from "react";
import getJwt from "@/utils/utils";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL + "/product";
const useProductApi = () => {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

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
    const jwtToken = await getJwt();
    setJwtToken(jwtToken);
    setLoading(true);

    // console.log("BASE_URL", BASE_URL);
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      // console.log("jwt in request", jwtToken);
      if (!response.ok) {
        // console.log("response", response);
        throw new Error("Product not found");
      }
      const result = await response.json();
      // const truncatedResult = JSON.stringify(result).substring(0, 600); DEBUG
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      // console.log("error here :", err);
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
    addProduct, //useless
    getProduct,
    updateProduct, //useless
    deleteProduct, //useless
  };
};

export default useProductApi;
