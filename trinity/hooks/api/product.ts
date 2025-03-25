import { ProductInShop } from "@/constants/interface/Product";
import { useState, useEffect } from "react";
import { getJwtFromStorage } from "@/hooks/auth";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL + "/products";
const useProductApi = () => {
  const [data, setData] = useState<ProductInShop | null>(null);
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
  const getProduct = async (id: string): Promise<ProductInShop | null> => {
    let tokenToUse = jwtToken;
    if (!jwtToken) {
      const token = await getJwtFromStorage();
      setJwtToken(token);
      tokenToUse = token;
      console.log("Retrieved token:", token);
    }
    console.log("Using token:", tokenToUse);
    setLoading(true);

    console.log("BASE_URL", BASE_URL);
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenToUse,
        },
      });
      console.log("jwt in request", tokenToUse);
      if (!response.ok) {
        console.log("response", response);
        throw new Error("Product not found" + response.statusText);
      }
      const result = await response.json();
      // console.log("result", result.code);
      // console.log("result", result.product.product_name_fr);
      setLoading(false);
      setData(result);
      console.log("loading", loading);
      return result;
    } catch (err) {
      setError(err as Error);
      console.log("error here :", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // const updateProduct = async (
  //   id: string,
  //   product: Product
  // ): Promise<any | null> => {
  //   setLoading(true);

  //   try {
  //     const response = await fetch(`${BASE_URL}/${id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(product),
  //     });
  //     if (!response.ok) {
  //       return null;
  //     }
  //     const result = await response.json();
  //     setData(result);
  //     return result;
  //   } catch (err) {
  //     setError(err as Error);
  //     throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const deleteProduct = async (id: string): Promise<boolean> => {
  //   setLoading(true);

  //   try {
  //     const response = await fetch(`${BASE_URL}/${id}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     return response.ok;
  //   } catch (err) {
  //     setError(err as Error);
  //     throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return {
    data,
    loading,
    error,
    setLoading,
    // addProduct, //useless
    getProduct,
    // updateProduct, //useless
    // deleteProduct, //useless
  };
};

export default useProductApi;
