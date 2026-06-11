import axios from "axios";
import { baseURL } from "@/utils/Endpoints";
import { attachAuthInterceptor, attachErrorInterceptor } from "./interceptors";

export const http = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

attachAuthInterceptor(http);
attachErrorInterceptor(http);
