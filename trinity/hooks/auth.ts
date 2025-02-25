import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom, useSetAtom } from 'jotai';

// const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL;
const apiBaseUrl = "https://e295-163-5-3-134.ngrok-free.app";

const atomIsAuthenticated = atom(false);

const useAuth = () => {
const authenticatedStatus = useSetAtom(atomIsAuthenticated);
const setAuthenticated = (status: boolean) => {authenticatedStatus(status)}
type creds = {
    username: string;
    password: string;
  };
async function saveJwtInStorage(jwt: string) {
    await AsyncStorage.setItem("jwt", jwt);
    console.log("jwt saved");
    console.log("jwt", jwt);
    console.log("local storage : " + await AsyncStorage.getItem("jwt"));
  }
  async function removeJwtFromStorage() {
    await AsyncStorage.removeItem("jwt");
  }
  async function getUserIdTokenFromStorage() {
    const jwt = await AsyncStorage.getItem("jwt");
    if (!jwt) {
      throw new Error("No token found");
    }
    const decodedToken = JSON.parse(atob(jwt.split(".")[1]));
    return decodedToken.sub;
  }
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
  return {atomIsAuthenticated, fetchJwtToken, saveJwtInStorage, removeJwtFromStorage, getUserIdTokenFromStorage,setAuthenticated}
};
export default useAuth;
