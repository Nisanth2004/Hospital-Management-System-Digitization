import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

const DoctorListAdmin = () => {
  const { districtId } = useParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    const res = await api.get(`/doctors/${districtId}`);
    setDoctors(res.data);
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    await api.delete(`/doctors/${id}`);
    loadDoctors();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="bg-white shadow rounded-xl p-6 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">
            District Doctor Registry
          </h1>
          <p className="text-sm text-gray-500">
            Government Health Department • District {districtId}
          </p>
        </div>

        <button
          onClick={() => navigate(`/admin/add-doctor/${districtId}`)}
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg"
        >
          ➕ Register Doctor
        </button>
      </div>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-6 gap-4 px-4 text-xs font-semibold text-gray-600 mb-2">
        <div>Doctor</div>
        <div>Department</div>
        <div>Shift</div>
        <div>Timing</div>
        <div>Status</div>
        <div>Admin Actions</div>
      </div>

      {/* LIST */}
      {doctors.map(d => (
        <div
          key={d.id}
          className="bg-white rounded-xl shadow px-4 py-4 grid grid-cols-6 gap-4 items-center mb-3"
        >
          <div>
            <p className="font-semibold text-gray-800">Dr. {d.name}</p>
            <p className="text-xs text-gray-500">{d.hospitalName}</p>
          </div>

          <div className="text-sm">{d.department}</div>

          <div className="text-sm">{d.shift}</div>

          <div className="text-sm">
            {d.shiftStartTime} – {d.shiftEndTime}
          </div>

          {/* STATUS – READ ONLY */}
          <div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium
              ${d.status === "AVAILABLE" && "bg-green-100 text-green-700"}
              ${d.status === "BUSY" && "bg-orange-100 text-orange-700"}
              ${d.status === "OFF_DUTY" && "bg-gray-200 text-gray-700"}
            `}>
              {d.status}
            </span>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/admin/edit-doctor/${d.id}`)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
            >
              Edit
            </button>

            <button
              onClick={() => deleteDoctor(d.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {doctors.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No doctors registered in this district
        </p>
      )}
    </div>
  );
};

export default DoctorListAdmin;
