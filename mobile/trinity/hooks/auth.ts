import { UserRole } from "@/queries/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { atom, useSetAtom } from "jotai";
import { loadable } from "jotai/utils";
import { jwtDecode } from "jwt-decode";
import { Alert } from "react-native";

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL;
// const apiBaseUrl = "https://e295-163-5-3-134.ngrok-free.app";

export type JWT_User = {
  exp: number;
  iat: number;
  role: UserRole;
  sub: number;
  username: string;
};

export const userAtom = atom<Promise<JWT_User | null> | JWT_User | null>(
  getUserTokenFromStorage()
);
export const loadableUserAtom = loadable(userAtom);

export const atomIsAuthenticated = atom((get) => {
  const res = get(loadableUserAtom);
  return res.state === "hasData" && res?.data !== null;
});

async function removeJwtFromStorage() {
  await AsyncStorage.removeItem("jwt");
}
export async function getUserTokenFromStorage() {
  try {
    const jwt = await AsyncStorage.getItem("jwt");
    if (!jwt) {
      return null;
    }
    const decodedToken: JWT_User = jwtDecode(jwt);
    return decodedToken;
  } catch (error) {
    return null;
  }
}
async function saveJwtInStorage(jwt: string) {
  await AsyncStorage.setItem("jwt", jwt);
  console.log("jwt saved");
  console.log("jwt", jwt);
  console.log("local storage : " + (await AsyncStorage.getItem("jwt")));
}

export const getJwtFromStorage = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem("jwt");
    return token;
  } catch (error) {
    return null;
  }
};

type creds = {
  username: string;
  password: string;
};
async function fetchJwtToken(creds: creds): Promise<string> {
  console.log("fetching jwt token");
  console.log("address" + apiBaseUrl + "/auth/login");
  const response = await fetch(apiBaseUrl + "/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(creds),
  });
  if (!response.ok) {
    throw new Error("Login failed" + JSON.stringify(response));
  }
  const data = await response.json();
  console.log("JWT ->", data.access_token);
  return data.access_token;
}

export const useLogout = () => {
  const setUser = useSetAtom(userAtom);

  return async (): Promise<void> => {
    try {
      console.log("Déconnexion de l'utilisateur...");
      await AsyncStorage.removeItem("jwt");

      setUser(null);

      const remainingToken = await AsyncStorage.getItem("jwt");
      if (remainingToken === null) {
        console.log("Utilisateur déconnecté avec succès");
        router.replace("/(auth)/login");
      } else {
        Alert.alert("Erreur", "Une erreur est survenue lors de la déconnexion");
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de la déconnexion");
    }
  };
};

export async function getUserIdFromJwt(): Promise<number | null> {
  try {
    const jwt = await AsyncStorage.getItem("jwt");
    if (!jwt) {
      console.log("Pas de token trouvé pour récupérer l'ID utilisateur");
      return null;
    }
    const decodedToken: JWT_User = jwtDecode(jwt);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      console.log("Token expiré");
      await removeJwtFromStorage();
      return null;
    }
    console.log("ID utilisateur:", decodedToken.sub);
    return decodedToken.sub;
  } catch (error) {
    return null;
  }
}

const useAuth = () => {
  const logout = useLogout();

  return {
    atomIsAuthenticated,
    fetchJwtToken,
    saveJwtInStorage,
    removeJwtFromStorage,
    getUserTokenFromStorage,
    getJwtFromStorage,
    getUserIdFromJwt,
    logout,
  };
};
export default useAuth;
