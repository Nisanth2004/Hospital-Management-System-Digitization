import axios from "axios";

export const fetchDistricts = async () => {
  const res = await axios.get("http://localhost:8081/api/admin/districts");
  return res.data;
};
