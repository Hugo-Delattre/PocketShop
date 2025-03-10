import { jwtConstants } from "../../utils/jwt";
import token from "../token";
import axios, {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";

const host = "http://209.38.247.123:3000";

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

apiClient.interceptors.request.use((request) => {
  const jwtToken: string | null = token.getToken(jwtConstants.key);
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
  (error) => {
    const { message } = error;
    const { status, data } = error.response;
    const { method, url } = error.config;

    if (status === 429) {
      token.removeToken("ACCESS_TOKEN_KEY");
      window.location.reload();
    }
    if (status === 401) {
      window.location.assign("/login");
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
