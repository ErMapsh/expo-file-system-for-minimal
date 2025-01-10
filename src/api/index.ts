import axios from "axios";
import { Platform } from "react-native";

export const API = axios.create({
  baseURL: Platform.Version == 23 ? "http://apps.goroga.in/public/api" : "https://apps.goroga.in/public/api",
});

export const API_V1 = axios.create({
  baseURL: "https://admin.goroga.in/public/api/v1/",
});

export const API_V2 = axios.create({
  baseURL: "http://admin.goroga.in/public/api/v2",
});
