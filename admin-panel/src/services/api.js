// services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api/admin",
});

export default api;
