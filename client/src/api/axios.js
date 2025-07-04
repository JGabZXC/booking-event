import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  timeout: 10000, // Set a timeout of 10 seconds
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
export default api;
