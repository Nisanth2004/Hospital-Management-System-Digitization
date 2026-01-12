// services/api.js
import axios from "axios";

const customaxios = axios.create({
  baseURL: "http://localhost:8080/api",
});

export default customaxios;
