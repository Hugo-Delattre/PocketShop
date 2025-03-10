import { UserRole } from "@/queries/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { jwtDecode } from "jwt-decode";

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
async function getUserTokenFromStorage() {
  const jwt = await AsyncStorage.getItem("jwt");
  if (!jwt) {
    console.error("No token found");
    return null;
  }
  const decodedToken: JWT_User = jwtDecode(jwt);
  return decodedToken;
}
async function saveJwtInStorage(jwt: string) {
  await AsyncStorage.setItem("jwt", jwt);
  console.log("jwt saved");
  console.log("jwt", jwt);
  console.log("local storage : " + (await AsyncStorage.getItem("jwt")));
}
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
    console.error("response", response);
    throw new Error("Login failed" + JSON.stringify(response));
  }
  const data = await response.json();
  console.log("JWT ->", data.access_token);
  return data.access_token;
}

const useAuth = () => {
  return {
    atomIsAuthenticated,
    fetchJwtToken,
    saveJwtInStorage,
    removeJwtFromStorage,
    getUserTokenFromStorage,
  };
};
export default useAuth;
