// services/api.js
import axios from "axios";

const customaxios = axios.create({
  baseURL: "http://localhost:8081/api",
});

export default customaxios;
