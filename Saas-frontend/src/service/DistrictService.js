import axios from "axios";

export const fetchDistricts = async () => {
  const res = await axios.get("http://localhost:8080/api/admin/districts");
  return res.data;
};
