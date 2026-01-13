import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const EditDoctorAdmin = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
    try {
      const res = await api.get(`/doctors/id/${doctorId}`);
      setDoctor(res.data);
      setLoading(false);
    } catch (err) {
      alert("Failed to load doctor details");
      navigate(-1);
    }
  };

  const updateDoctor = async () => {
    try {
      await api.put(`/doctors/${doctorId}`, doctor);
      alert("Doctor details updated successfully");
      navigate(-1);
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading doctor details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-blue-900">
          Edit Doctor Details
        </h1>
        <p className="text-sm text-gray-500">
          Government Health Department – Administrative Access
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-xl shadow p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 gap-5">

          {/* NAME */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Doctor Name
            </label>
            <input
              value={doctor.name}
              onChange={e => setDoctor({ ...doctor, name: e.target.value })}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              value={doctor.email}
              onChange={e => setDoctor({ ...doctor, email: e.target.value })}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          {/* DEPARTMENT */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Department
            </label>
            <input
              value={doctor.department}
              onChange={e => setDoctor({ ...doctor, department: e.target.value })}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          {/* HOSPITAL */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Hospital Name
            </label>
            <input
              value={doctor.hospitalName}
              onChange={e => setDoctor({ ...doctor, hospitalName: e.target.value })}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          {/* WARD */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Ward Type
            </label>
            <input
              value={doctor.wardType}
              onChange={e => setDoctor({ ...doctor, wardType: e.target.value })}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          {/* SHIFT */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Shift
            </label>
            <select
              value={doctor.shift}
              onChange={e => setDoctor({ ...doctor, shift: e.target.value })}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option>DAY</option>
              <option>NIGHT</option>
            </select>
          </div>

          {/* SHIFT START */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Shift Start Time
            </label>
            <input
              type="time"
              value={doctor.shiftStartTime}
              onChange={e =>
                setDoctor({ ...doctor, shiftStartTime: e.target.value })
              }
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          {/* SHIFT END */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Shift End Time
            </label>
            <input
              type="time"
              value={doctor.shiftEndTime}
              onChange={e =>
                setDoctor({ ...doctor, shiftEndTime: e.target.value })
              }
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          {/* STATUS – READ ONLY */}
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Current Status (Read Only)
            </label>
            <div className="mt-2">
              <span className={`text-xs px-3 py-1 rounded-full font-medium
                ${doctor.status === "AVAILABLE" && "bg-green-100 text-green-700"}
                ${doctor.status === "BUSY" && "bg-orange-100 text-orange-700"}
                ${doctor.status === "OFF_DUTY" && "bg-gray-200 text-gray-700"}
              `}>
                {doctor.status}
              </span>
            </div>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded border text-gray-700"
          >
            Cancel
          </button>

          <button
            onClick={updateDoctor}
            className="px-6 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDoctorAdmin;
