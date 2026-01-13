import React, { useState } from "react";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";

const AddDoctorAdmin = () => {
  const { districtId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    hospitalName: "",
    wardType: "",
    shift: "",
    shiftStartTime: "",
    shiftEndTime: "",
  });

  const addDoctor = async () => {
    await api.post("/doctors", {
      ...form,
      districtId,
      status: "AVAILABLE",
      onLeave: false,
    });
    navigate(`/district/${districtId}/doctor-management`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h1 className="text-2xl font-bold text-blue-800">
          Register New Doctor
        </h1>
        <p className="text-sm text-gray-500">
          Government Hospital • District {districtId}
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="grid grid-cols-2 gap-4">

          <Input label="Doctor Name" onChange={v => setForm({...form, name: v})}/>
          <Input label="Official Email" onChange={v => setForm({...form, email: v})}/>
          <Input label="Password" type="password" onChange={v => setForm({...form, password: v})}/>
          <Input label="Department" onChange={v => setForm({...form, department: v})}/>
          <Input label="Hospital Name" onChange={v => setForm({...form, hospitalName: v})}/>
          
          <Select label="Ward Type" options={["ICU","GENERAL","EMERGENCY"]} onChange={v => setForm({...form, wardType: v})}/>
          <Select label="Shift" options={["MORNING","EVENING","NIGHT"]} onChange={v => setForm({...form, shift: v})}/>
          
          <Input label="Shift Start Time" type="time" onChange={v => setForm({...form, shiftStartTime: v})}/>
          <Input label="Shift End Time" type="time" onChange={v => setForm({...form, shiftEndTime: v})}/>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded border"
          >
            Cancel
          </button>
          <button
            onClick={addDoctor}
            className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium"
          >
            Save Doctor
          </button>
        </div>
      </div>
    </div>
  );
};

/* Reusable Components */

const Input = ({ label, type="text", onChange }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-600"
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

const Select = ({ label, options, onChange }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      className="w-full mt-1 border rounded-lg p-2"
      onChange={e => onChange(e.target.value)}
    >
      <option value="">Select</option>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </div>
);

export default AddDoctorAdmin;
