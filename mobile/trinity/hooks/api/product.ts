import { ProductInShop } from "@/constants/interface/Product";
import { useState, useEffect } from "react";
import { getJwtFromStorage, useLogout } from "@/hooks/auth";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL + "/products";
const useProductApi = () => {
  const [data, setData] = useState<ProductInShop | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const logout = useLogout();
  useEffect(() => {
    const retrieveJwtToken = async () => {
      const token = await getJwtFromStorage();
      setJwtToken(token);
    };
    retrieveJwtToken();
  }, []);
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
      console.log("response Status", response.status);
      if (response.status !== 200) {
        if (response.status === 403) {
          console.log("403 error");
          setError(new Error(`Session invalide, veuillez vous reconnecter`));
          logout();
        }
        if (response.status === 404) {
          console.log("response", response);
          setError(
            new Error(
              `Produit non disponible, veuillez scanner un autre produit`
            )
          );
        } else if (!response.ok) {
          console.log("response", response);
          setError(
            new Error(
              `Erreur lors de la récupération du produit, veuillez réessayer`
            )
          );
        }
      } else {
        const result = await response.json();
        setData(result);
        setLoading(false);
        console.log("loading", loading);
        setError(null);
        return result;
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      console.log("finally");
      setLoading(false);
    }
  };
  return {
    data,
    loading,
    error,
    setLoading,
    getProduct,
  };
};

export default useProductApi;
