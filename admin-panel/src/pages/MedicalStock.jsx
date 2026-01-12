import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useParams } from "react-router-dom";

const MedicalStock = () => {
  const { districtId } = useParams();
  const [stocks, setStocks] = useState([]);
  const [activeTab, setActiveTab] = useState("list");
  const [formData, setFormData] = useState({
    medicineName: "",
    category: "",
    quantity: "",
    unit: "",
    expiryDate: "",
    manufacturer: ""
  });
  const UNITS = [
  "Tablets",
  "Strips",
  "Bottles",
  "Vials",
  "Ampoules",
  "ml",
  "mg",
  "Units",
  "Boxes"
];

  const [editingId, setEditingId] = useState(null);

  const loadStocks = () => {
    api.get(`/medical-stock/${districtId}`)
      .then(res => setStocks(res.data));
  };

  useEffect(() => {
    loadStocks();
  }, [districtId]);

  const handleSubmit = () => {
    const apiCall = editingId
      ? api.put(`/medical-stock/${editingId}`, formData)
      : api.post(`/medical-stock/${districtId}`, formData);

    apiCall.then(() => {
      loadStocks();
      setActiveTab("list");
      setEditingId(null);
      setFormData({
        medicineName: "",
        category: "",
        quantity: "",
        unit: "",
        expiryDate: "",
        manufacturer: ""
      });
    });
  };

  const handleEdit = (stock) => {
    setEditingId(stock.id);
    setFormData(stock);
    setActiveTab("add");
  };

  const handleDelete = (id) => {
    if (confirm("Delete this medicine?")) {
      api.delete(`/medical-stock/${id}`).then(loadStocks);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ===== Sidebar ===== */}
      <aside className="w-64 bg-white border-r p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800">
          Medical Stock
        </h2>

        <button
          onClick={() => setActiveTab("add")}
          className={`w-full text-left px-4 py-2 rounded mb-2
            ${activeTab === "add" ? "bg-green-700 text-white" : "hover:bg-gray-100"}`}
        >
          ➕ Add Medicine
        </button>

        <button
          onClick={() => setActiveTab("list")}
          className={`w-full text-left px-4 py-2 rounded
            ${activeTab === "list" ? "bg-green-700 text-white" : "hover:bg-gray-100"}`}
        >
          📋 All Medicines
        </button>
      </aside>

      {/* ===== Content ===== */}
      <main className="flex-1 p-10">

       {activeTab === "add" && (
  <div className="bg-white p-8 rounded-xl shadow-sm max-w-2xl">
    <h3 className="text-2xl font-semibold mb-6">
      {editingId ? "Update Medicine" : "Add Medicine"}
    </h3>

    {/* Medicine Name */}
    <input
      type="text"
      placeholder="Medicine Name"
      value={formData.medicineName}
      onChange={(e) =>
        setFormData({ ...formData, medicineName: e.target.value })
      }
      className="w-full border p-3 rounded mb-4"
    />

    {/* Category */}
    <input
      type="text"
      placeholder="Category (e.g. Painkiller, Antibiotic)"
      value={formData.category}
      onChange={(e) =>
        setFormData({ ...formData, category: e.target.value })
      }
      className="w-full border p-3 rounded mb-4"
    />

    {/* Quantity */}
    <input
      type="number"
      placeholder="Quantity"
      value={formData.quantity}
      onChange={(e) =>
        setFormData({ ...formData, quantity: e.target.value })
      }
      className="w-full border p-3 rounded mb-4"
    />

    {/* Unit Dropdown */}
    <select
      value={formData.unit}
      onChange={(e) =>
        setFormData({ ...formData, unit: e.target.value })
      }
      className="w-full border p-3 rounded mb-4 bg-white"
    >
      <option value="">Select Unit</option>
      {UNITS.map((unit) => (
        <option key={unit} value={unit}>
          {unit}
        </option>
      ))}
    </select>

    {/* Expiry Date */}
    <input
      type="date"
      value={formData.expiryDate}
      onChange={(e) =>
        setFormData({ ...formData, expiryDate: e.target.value })
      }
      className="w-full border p-3 rounded mb-4"
    />

    {/* Manufacturer */}
    <input
      type="text"
      placeholder="Manufacturer"
      value={formData.manufacturer}
      onChange={(e) =>
        setFormData({ ...formData, manufacturer: e.target.value })
      }
      className="w-full border p-3 rounded mb-6"
    />

    <button
      onClick={handleSubmit}
      className="bg-green-700 text-white px-6 py-3 rounded hover:bg-green-800"
    >
      {editingId ? "Update Medicine" : "Save Medicine"}
    </button>
  </div>
)}
{activeTab === "list" && (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <table className="w-full border-collapse">
      <thead className="bg-gray-50">
        <tr>
          <th className="p-3 text-left">Medicine</th>
          <th className="p-3">Category</th>
          <th className="p-3">Quantity</th>
          <th className="p-3">Unit</th>
          <th className="p-3">Expiry</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        {stocks.length === 0 && (
          <tr>
            <td colSpan="6" className="p-6 text-center text-gray-500">
              No medicines found for this district
            </td>
          </tr>
        )}

        {stocks.map((s) => (
          <tr key={s.id} className="border-t hover:bg-gray-50">
            <td className="p-3">{s.medicineName}</td>
            <td className="p-3">{s.category}</td>
            <td className="p-3">{s.quantity}</td>
            <td className="p-3">{s.unit}</td>
            <td className="p-3">{s.expiryDate}</td>
            <td className="p-3">
  <div className="flex items-center gap-2">
    <button
      onClick={() => handleEdit(s)}
      className="
        px-3 py-1.5 text-sm font-medium rounded-full
        bg-blue-100 text-blue-700
        hover:bg-blue-600 hover:text-white
        transition
      "
    >
      ✏️ Edit
    </button>

    <button
      onClick={() => handleDelete(s.id)}
      className="
        px-3 py-1.5 text-sm font-medium rounded-full
        bg-red-100 text-red-700
        hover:bg-red-600 hover:text-white
        transition
      "
    >
      🗑 Delete
    </button>
  </div>
</td>

          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

      

      </main>
    </div>
  );
};

export default MedicalStock;
