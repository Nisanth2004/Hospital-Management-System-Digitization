import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { assets } from "../assets/assets";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";

/* ============================
   MAIN COMPONENT
============================ */

const BedManagementAdmin = () => {
  const { districtId } = useParams();

  const [beds, setBeds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [dischargeTime, setDischargeTime] = useState("");

  // Filters
  const [wardFilter, setWardFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const BED_TYPES = ["Oxygen", "Ventilator", "Normal"];
  const WARD_TYPES = ["ICU", "General", "Emergency"];

  const [form, setForm] = useState({
    hospitalName: "",
    wardType: "",
    bedNumber: "",
    bedType: "",
  });

  /* ============================
     FETCH DATA
  ============================ */

  useEffect(() => {
    fetchBeds();
  }, [districtId]);

  const fetchBeds = () => {
    api.get(`/beds/${districtId}`)
      .then(res => setBeds(res.data))
      .catch(console.error);
  };

  /* ============================
     DERIVED DATA
  ============================ */

  const totalBeds = beds.length;
  const availableBeds = beds.filter(b => !b.occupied).length;
  const occupiedBeds = beds.filter(b => b.occupied).length;

  const icuAvailable = beds.filter(
    b => b.wardType === "ICU" && !b.occupied
  ).length;

  const chartData = useMemo(() => {
    return ["ICU", "General", "Emergency"].map(w => {
      const wardBeds = beds.filter(b => b.wardType === w);
      return {
        ward: w,
        Available: wardBeds.filter(b => !b.occupied).length,
        Occupied: wardBeds.filter(b => b.occupied).length
      };
    });
  }, [beds]);

  const filteredBeds = useMemo(() => {
    return beds.filter(bed => {
      if (wardFilter !== "ALL" && bed.wardType !== wardFilter) return false;
      if (typeFilter !== "ALL" && bed.bedType !== typeFilter) return false;
      if (statusFilter === "AVAILABLE" && bed.occupied) return false;
      if (statusFilter === "OCCUPIED" && !bed.occupied) return false;
      return true;
    });
  }, [beds, wardFilter, typeFilter, statusFilter]);

  /* ============================
     ACTIONS
  ============================ */

  const addBed = () => {
    api.post(`/beds/${districtId}`, { ...form, occupied: false })
      .then(() => {
        setForm({
          hospitalName: "",
          wardType: "",
          bedNumber: "",
          bedType: "",
        });
        setShowForm(false);
        fetchBeds();
      });
  };

  const deleteBed = (id) => {
    if (!window.confirm("Delete this bed?")) return;
    api.delete(`/beds/${id}`).then(fetchBeds);
  };

  const saveBedUpdate = () => {
    if (selectedBed.occupied && !dischargeTime) {
      alert("Please set expected discharge time");
      return;
    }

    api.put(`/beds/${selectedBed.id}`, {
      occupied: selectedBed.occupied,
      expectedDischarge: selectedBed.occupied ? dischargeTime : null
    }).then(() => {
      setSelectedBed(null);
      fetchBeds();
    });
  };

  /* ============================
     UI
  ============================ */

  return (
    <div className="min-h-screen bg-[#f4f6f8] p-6">

      <h2 className="text-3xl font-bold mb-1">District Bed Management</h2>
      <p className="text-gray-600 mb-6">District ID: {districtId}</p>

      {icuAvailable === 0 && (
        <div className="bg-red-600 text-white p-3 rounded mb-6">
          🚨 ICU FULL — Monitor discharges closely
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Beds" value={totalBeds} color="blue" />
        <StatCard label="Available" value={availableBeds} color="green" />
        <StatCard label="Occupied" value={occupiedBeds} color="red" />
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow flex gap-4 mb-6">
        <FilterSelect label="Ward" value={wardFilter} onChange={setWardFilter} options={["ALL", ...WARD_TYPES]} />
        <FilterSelect label="Bed Type" value={typeFilter} onChange={setTypeFilter} options={["ALL", ...BED_TYPES]} />
        <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={["ALL", "AVAILABLE", "OCCUPIED"]} />
      </div>

      {/* ADD BED */}
      <button onClick={() => setShowForm(!showForm)} className="mb-6 bg-blue-700 text-white px-6 py-2 rounded-lg">
        + Add New Bed
      </button>

      {/* FORM */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border p-2 rounded" placeholder="Hospital Name"
            value={form.hospitalName}
            onChange={e => setForm({ ...form, hospitalName: e.target.value })} />

          <select className="border p-2 rounded"
            value={form.wardType}
            onChange={e => setForm({ ...form, wardType: e.target.value })}>
            <option value="">Select Ward</option>
            {WARD_TYPES.map(w => <option key={w}>{w}</option>)}
          </select>

          <input className="border p-2 rounded" placeholder="Bed Number"
            value={form.bedNumber}
            onChange={e => setForm({ ...form, bedNumber: e.target.value })} />

          <select className="border p-2 rounded"
            value={form.bedType}
            onChange={e => setForm({ ...form, bedType: e.target.value })}>
            <option value="">Select Bed Type</option>
            {BED_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>

          <button onClick={addBed} className="col-span-full bg-green-700 text-white py-2 rounded">
            Save Bed
          </button>
        </div>
      )}

      {/* CHART */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <h3 className="text-xl font-semibold mb-4">Ward-wise Occupancy</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="ward" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Available" fill="#16a34a" />
            <Bar dataKey="Occupied" fill="#dc2626" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* BED GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {filteredBeds.map(bed => (
          <div key={bed.id}
            onClick={() => {
              setSelectedBed(bed);
              setDischargeTime(bed.expectedDischarge?.slice(0, 16) || "");
            }}
            className={`p-4 rounded-xl shadow cursor-pointer ${bed.occupied ? "bg-red-100" : "bg-green-100"}`}>

            <button onClick={(e) => { e.stopPropagation(); deleteBed(bed.id); }}
              className="absolute top-2 right-2 bg-black text-white text-xs px-2 rounded">✕</button>

            <img src={assets.bed} className="w-20 mx-auto mb-2" />
            <h4 className="text-center font-bold">{bed.bedNumber}</h4>
            <p className="text-center text-sm">{bed.wardType}</p>
            <p className="text-center text-xs">{bed.bedType}</p>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {/* MODAL */}
{selectedBed && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-[420px] shadow-lg">

      <h3 className="text-lg font-bold mb-4">
        Update Bed Status
      </h3>

      {/* TOGGLE */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-700">
          Bed Status
        </span>

        <div
          onClick={() => {
            const newStatus = !selectedBed.occupied;
            setSelectedBed({
              ...selectedBed,
              occupied: newStatus
            });

            if (!newStatus) {
              setDischargeTime("");
            }
          }}
          className={`w-14 h-7 flex items-center rounded-full cursor-pointer transition
            ${selectedBed.occupied ? "bg-red-600" : "bg-green-600"}`}
        >
          <div
            className={`bg-white w-6 h-6 rounded-full shadow transform transition
              ${selectedBed.occupied ? "translate-x-7" : "translate-x-1"}`}
          />
        </div>
      </div>

      {/* STATUS LABEL */}
      <p className="text-sm mb-3">
        Status:
        <span
          className={`ml-2 font-semibold
            ${selectedBed.occupied ? "text-red-600" : "text-green-700"}`}
        >
          {selectedBed.occupied ? "Occupied" : "Available"}
        </span>
      </p>

      {/* DISCHARGE TIME */}
      {selectedBed.occupied && (
        <div className="mb-4">
          <label className="text-sm text-gray-600 block mb-1">
            Expected Discharge Time
          </label>
          <input
            type="datetime-local"
            min={new Date().toISOString().slice(0, 16)}
            className="w-full border p-2 rounded"
            value={dischargeTime}
            onChange={e => setDischargeTime(e.target.value)}
          />
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={saveBedUpdate}
          className="flex-1 bg-green-700 text-white py-2 rounded-lg"
        >
          Save Changes
        </button>

        <button
          onClick={() => setSelectedBed(null)}
          className="flex-1 bg-gray-200 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>

    </div>
  </div>
)}


    </div>
  );
};

/* ============================
   SMALL COMPONENTS
============================ */

const colorMap = {
  blue: "border-blue-600",
  green: "border-green-600",
  red: "border-red-600"
};

const StatCard = ({ label, value, color }) => (
  <div className={`bg-white p-4 rounded-xl shadow border-l-4 ${colorMap[color]}`}>
    <p className="text-gray-600 text-sm">{label}</p>
    <h3 className="text-2xl font-bold">{value}</h3>
  </div>
);

const FilterSelect = ({ label, value, onChange, options }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <select className="border rounded px-3 py-2 block mt-1"
      value={value} onChange={e => onChange(e.target.value)}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </div>
);

export default BedManagementAdmin;
