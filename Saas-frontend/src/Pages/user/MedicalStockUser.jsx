import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import customaxios from "../../service/customAxios";
import { useNavigate } from "react-router-dom";

const MedicalStockUser = () => {
  const { districtId } = useParams();
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");
   const navigate = useNavigate();
   const [districtName, setDistrictName] = useState("");
 const fetchStocks = () => {
    customaxios.get(`/public/medical-stock/${districtId}`)
      .then(res => setStocks(res.data))
      .catch(err => console.error(err));
  };
  useEffect(() => {
    fetchStocks();
  }, [districtId]);

useEffect(() => {
  customaxios.get(`/admin/districts/${districtId}`)
    .then(res => setDistrictName(res.data.name));

  fetchStocks();
}, [districtId]);

 

  const handleSearch = () => {
    if (!search) {
      fetchStocks();
      return;
    }

    customaxios.get(`/public/medical-stock/${districtId}/search?keyword=${search}`)
      .then(res => setStocks(res.data))
      .catch(err => console.error(err));
  };

  const getStatus = (qty) => {
    if (qty > 50) return "Available";
    if (qty > 0) return "Limited";
    return "Out of Stock";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h2 className="text-3xl font-bold mb-6">
        Medical Stock –  {districtName}
      </h2>

      {/* SEARCH */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search medicine name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2"
        />
        <button
          onClick={handleSearch}
          className="bg-green-700 text-white px-6 rounded-lg"
        >
          Search
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3">Medicine</th>
              <th className="p-3">Category</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Expiry</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(stock => (
              <tr key={stock.id} className="border-t">
                <td className="p-3">{stock.medicineName}</td>
                <td className="p-3">{stock.category}</td>
                <td className="p-3">{stock.quantity}</td>
                <td className="p-3">{stock.unit}</td>
                <td className="p-3">{stock.expiryDate}</td>
                <td className="p-3">
                  <span className={
                    stock.quantity > 0
                      ? "text-green-700 font-semibold"
                      : "text-red-600 font-semibold"
                  }>
                    {getStatus(stock.quantity)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {stocks.length === 0 && (
          <p className="text-center p-6 text-gray-500">
            No medical stock available
          </p>
        )}
      </div>
    </div>
  );
};

export default MedicalStockUser;
