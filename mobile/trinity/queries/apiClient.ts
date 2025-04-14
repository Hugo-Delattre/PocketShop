import { userAtom } from "@/hooks/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import { router } from "expo-router";
import { getDefaultStore } from "jotai";

const host = process.env.EXPO_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: host,
});

const logOnDev = (
  message: string,
  log?: AxiosResponse | InternalAxiosRequestConfig | AxiosError
) => {
  if (process.env.NODE_ENV === "development") {
    console.log(message, log);
  }
};

apiClient.interceptors.request.use(async (request) => {
  const jwtToken: string | null = await AsyncStorage.getItem("jwt");
  const { method, url } = request;

  if (jwtToken) {
    request.headers["Authorization"] = `Bearer ${jwtToken}`;
  }

  logOnDev(`🚀 [${method?.toUpperCase()}] ${url} | Request`, request);

  return request;
});

apiClient.interceptors.response.use(
  (response) => {
    const { method, url } = response.config;
    const { status } = response;

    logOnDev(
      `✨ [${method?.toUpperCase()}] ${url} | Response ${status}`,
      response
    );

    return response;
  },
  async (error) => {
    const { message } = error;
    const { status, data } = error.response;
    const { method, url } = error.config;

    if (status === 429) {
      await AsyncStorage.removeItem("jwt");
      window.location.reload();
    }
    if (status === 401 || 403) {
      const store = getDefaultStore();
      router.replace("/(tabs)");
      store.set(userAtom, null);
    }

    logOnDev(
      `🚨 [${method?.toUpperCase()}] ${url} | Error ${status} ${
        data?.message || ""
      } | ${message}`,
      error
    );

    return Promise.reject(error);
  }
);

export default apiClient;
