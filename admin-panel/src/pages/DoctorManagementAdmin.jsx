import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useParams } from "react-router-dom";


const DoctorManagementAdmin = () => {

  const [doctors, setDoctors] = useState([]);
const { districtId, talukId } = useParams();

  const [form, setForm] = useState({
    name: "",
    department: "",
    hospitalName: "",
    wardType: "",
    shift: ""
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
  const res = await api.get(`/doctors/${districtId}/${talukId}`);

    setDoctors(res.data);
  };

  const addDoctor = async () => {
    await api.post("/doctors", {
      ...form,
      districtId,
      status: "AVAILABLE",
      onLeave: false
    });

    
    fetchDoctors();
  };

  const updateStatus = async (id, status, onLeave) => {
    await api.put(`/doctors/${id}/status`, null, {
      params: { status, onLeave }
    });
    fetchDoctors();
  };

  return (
    <div className="p-6 bg-[#f4f6f8] min-h-screen">

      <h2 className="text-3xl font-bold mb-6">Doctor Management</h2>

      {/* ADD DOCTOR */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-2 gap-4">
        <input placeholder="Doctor Name" onChange={e => setForm({...form, name: e.target.value})} />
        <input placeholder="Department" onChange={e => setForm({...form, department: e.target.value})} />
        <input placeholder="Hospital" onChange={e => setForm({...form, hospitalName: e.target.value})} />

        <select onChange={e => setForm({...form, wardType: e.target.value})}>
          <option value="">Ward</option>
          <option>ICU</option>
          <option>GENERAL</option>
          <option>EMERGENCY</option>
        </select>

        <select onChange={e => setForm({...form, shift: e.target.value})}>
          <option value="">Shift</option>
          <option>MORNING</option>
          <option>EVENING</option>
          <option>NIGHT</option>
        </select>

        <button onClick={addDoctor} className="col-span-2 bg-blue-700 text-white py-2 rounded">
          Add Doctor
        </button>
      </div>

      {/* DOCTOR LIST */}
      <div className="space-y-4">
        {doctors.map(d => (
          <div key={d.id} className="bg-white p-4 rounded-xl shadow flex justify-between">

            <div>
              <h3 className="font-bold">{d.name}</h3>
              <p className="text-sm">{d.department} • {d.hospitalName}</p>
              <p className="text-xs">{d.wardType} • {d.shift}</p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => updateStatus(d.id, "AVAILABLE", false)} className="bg-green-600 text-white px-3 rounded">
                Available
              </button>
              <button onClick={() => updateStatus(d.id, "BUSY", false)} className="bg-orange-600 text-white px-3 rounded">
                Busy
              </button>
              <button onClick={() => updateStatus(d.id, "OFF_DUTY", true)} className="bg-gray-500 text-white px-3 rounded">
                Leave
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default DoctorManagementAdmin;
