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
  const { districtId, talukId } = useParams();


  const [beds, setBeds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [dischargeTime, setDischargeTime] = useState("");
  const [activeWard, setActiveWard] = useState("ICU");

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
     STATS
  ============================ */

  const totalBeds = beds.length;
  const availableBeds = beds.filter(b => !b.occupied).length;
  const occupiedBeds = beds.filter(b => b.occupied).length;

  const icuAvailable = beds.filter(
    b => b.wardType === "ICU" && !b.occupied
  ).length;

  /* ============================
     CHART DATA
  ============================ */

  const chartData = useMemo(() => {
    return WARD_TYPES.map(w => {
      const wardBeds = beds.filter(b => b.wardType === w);
      return {
        ward: w,
        Available: wardBeds.filter(b => !b.occupied).length,
        Occupied: wardBeds.filter(b => b.occupied).length
      };
    });
  }, [beds]);

  /* ============================
     WARD DATA
  ============================ */

  const wardBeds = beds.filter(b => b.wardType === activeWard);
  const availableWardBeds = wardBeds.filter(b => !b.occupied);
  const occupiedWardBeds = wardBeds.filter(b => b.occupied);

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

      <h2 className="text-3xl font-bold mb-2">District Bed Management</h2>
      <p className="text-gray-600 mb-6">District ID: {districtId}</p>

      {icuAvailable === 0 && (
        <div className="bg-red-600 text-white p-3 rounded mb-6">
          🚨 ICU FULL — Immediate attention required
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Beds" value={totalBeds} color="blue" />
        <StatCard label="Available" value={availableBeds} color="green" />
        <StatCard label="Occupied" value={occupiedBeds} color="red" />
      </div>

      {/* ADD BED */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 bg-blue-700 text-white px-6 py-2 rounded-lg"
      >
        + Add New Bed
      </button>

      {/* ADD BED FORM */}
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

      {/* WARD TABS */}
      <div className="flex gap-3 mb-6">
        {WARD_TYPES.map(w => (
          <button
            key={w}
            onClick={() => setActiveWard(w)}
            className={`px-6 py-2 rounded-lg font-medium
              ${activeWard === w ? "bg-blue-700 text-white" : "bg-white shadow"}`}
          >
            {w} Ward
          </button>
        ))}
      </div>

      {/* WARD LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* AVAILABLE */}
        <WardColumn
          title="Available Beds"
          beds={availableWardBeds}
          color="green"
          onSelect={setSelectedBed}
          onDelete={deleteBed}
          setDischargeTime={setDischargeTime}
        />

        {/* OCCUPIED */}
        <WardColumn
          title="Occupied Beds"
          beds={occupiedWardBeds}
          color="red"
          onSelect={setSelectedBed}
          onDelete={deleteBed}
          setDischargeTime={setDischargeTime}
        />

      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded-xl shadow mt-10">
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

      {/* MODAL */}
      {selectedBed && (
        <BedModal
          bed={selectedBed}
          dischargeTime={dischargeTime}
          setDischargeTime={setDischargeTime}
          setSelectedBed={setSelectedBed}
          onSave={saveBedUpdate}
        />
      )}

    </div>
  );
};

/* ============================
   REUSABLE COMPONENTS
============================ */

const WardColumn = ({ title, beds, color, onSelect, onDelete, setDischargeTime }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <h3 className={`text-lg font-bold mb-3 text-${color}-700`}>
      {title} ({beds.length})
    </h3>

    <div className="max-h-[420px] overflow-y-auto space-y-3">
      {beds.map(bed => (
        <div
          key={bed.id}
          onClick={() => {
            onSelect(bed);
            setDischargeTime(bed.expectedDischarge?.slice(0, 16) || "");
          }}
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer
            ${bed.occupied ? "bg-red-100" : "bg-green-100"}`}
        >
          <div>
            <p className="font-semibold">{bed.bedNumber}</p>
            <p className="text-xs">{bed.bedType}</p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(bed.id);
            }}
            className="text-xs bg-black text-white px-2 rounded"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  </div>
);

const BedModal = ({ bed, dischargeTime, setDischargeTime, setSelectedBed, onSave }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-[420px]">

      <h3 className="text-lg font-bold mb-4">Update Bed Status</h3>

      <div className="flex justify-between mb-4">
        <span>Status</span>
        <button
          onClick={() => {
            const newStatus = !bed.occupied;
            setSelectedBed({ ...bed, occupied: newStatus });
            if (!newStatus) setDischargeTime("");
          }}
          className={`px-4 py-1 rounded-full text-white
            ${bed.occupied ? "bg-red-600" : "bg-green-600"}`}
        >
          {bed.occupied ? "Occupied" : "Available"}
        </button>
      </div>

      {bed.occupied && (
        <input
          type="datetime-local"
          className="w-full border p-2 rounded mb-4"
          value={dischargeTime}
          onChange={e => setDischargeTime(e.target.value)}
        />
      )}

      <div className="flex gap-3">
        <button onClick={onSave} className="flex-1 bg-green-700 text-white py-2 rounded">
          Save
        </button>
        <button onClick={() => setSelectedBed(null)} className="flex-1 bg-gray-200 py-2 rounded">
          Cancel
        </button>
      </div>

    </div>
  </div>
);

const StatCard = ({ label, value, color }) => (
  <div className={`bg-white p-4 rounded-xl shadow border-l-4 border-${color}-600`}>
    <p className="text-gray-600 text-sm">{label}</p>
    <h3 className="text-2xl font-bold">{value}</h3>
  </div>
);

export default BedManagementAdmin;
