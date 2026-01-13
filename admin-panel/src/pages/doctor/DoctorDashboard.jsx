import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import  axios  from 'axios';

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(
    JSON.parse(localStorage.getItem("doctor"))
  );
  const navigate = useNavigate();

  const [timing, setTiming] = useState({
    start: doctor.shiftStartTime || "",
    end: doctor.shiftEndTime || ""
  });

  const [tokens, setTokens] = useState([]);

  const logout = () => {
    localStorage.removeItem("doctor");
    navigate("/doctor/login");
  };

  const [newPassword, setNewPassword] = useState("");

  const refreshDoctor = d => {
    setDoctor(d);
    localStorage.setItem("doctor", JSON.stringify(d));
  };

  // Fetch doctor tokens
  const fetchTokens = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/api/token/doctor/${doctor.id}`);
      setTokens(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, [doctor.id]);

  const updateStatus = async status => {
    const res = await api.put("/doctor/status", null, {
      params: { email: doctor.email, status }
    });
    refreshDoctor(res.data);
  };

  const updateTiming = async () => {
    const res = await api.put("/doctor/timing", null, {
      params: {
        email: doctor.email,
        startTime: timing.start,
        endTime: timing.end
      }
    });
    refreshDoctor(res.data);
  };

  const updateLeave = async onLeave => {
    const res = await api.put("/doctor/leave", null, {
      params: { email: doctor.email, onLeave }
    });
    refreshDoctor(res.data);
  };

  const changePassword = async () => {
    await api.put("/doctor/password", null, {
      params: { email: doctor.email, newPassword }
    });
    alert("Password updated successfully");
    setNewPassword("");
  };

  const updateTokenStatus = async (tokenId, status) => {
    try {
      const res = await axios.put(`http://localhost:8081/api/token/doctor/update-status/${tokenId}?status=${status}`);
      setTokens(prev => prev.map(t => (t.id === tokenId ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* HEADER */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            🏥 Government Doctor Portal
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome, Dr. {doctor.name}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold
            ${doctor.status === "AVAILABLE" && "bg-green-100 text-green-700"}
            ${doctor.status === "BUSY" && "bg-orange-100 text-orange-700"}
            ${doctor.status === "OFF_DUTY" && "bg-gray-200 text-gray-700"}
          `}>
            {doctor.status}
          </span>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PROFILE */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">👨‍⚕️ Doctor Profile</h2>
          <div className="space-y-2 text-gray-700">
            <p><b>Name:</b> Dr. {doctor.name}</p>
            <p><b>Email:</b> {doctor.email}</p>
            <p><b>Department:</b> {doctor.department}</p>
            <p><b>Hospital:</b> {doctor.hospitalName}</p>
          </div>
        </div>

        {/* STATUS */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">📊 Duty Status</h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => updateStatus("AVAILABLE")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
              Available
            </button>
            <button onClick={() => updateStatus("BUSY")}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg">
              Busy
            </button>
            <button onClick={() => updateStatus("OFF_DUTY")}
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg">
              Off Duty
            </button>
          </div>
        </div>

        {/* SHIFT */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">⏰ Shift Timing</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="time"
              value={timing.start}
              onChange={e => setTiming({ ...timing, start: e.target.value })}
              className="border p-2 rounded-lg w-full"
            />
            <input
              type="time"
              value={timing.end}
              onChange={e => setTiming({ ...timing, end: e.target.value })}
              className="border p-2 rounded-lg w-full"
            />
            <button
              onClick={updateTiming}
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg">
              Save
            </button>
          </div>
        </div>

        {/* LEAVE */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">🏖 Leave Management</h2>
          <button
            onClick={() => updateLeave(!doctor.onLeave)}
            className={`px-6 py-2 rounded-lg text-white
              ${doctor.onLeave ? "bg-green-700 hover:bg-green-800" : "bg-purple-700 hover:bg-purple-800"}
            `}
          >
            {doctor.onLeave ? "Return From Leave" : "Apply for Leave"}
          </button>
        </div>

        {/* PASSWORD */}
        <div className="bg-white p-6 rounded-2xl shadow lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">🔑 Change Password</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="border p-2 rounded-lg w-full sm:w-80"
            />
            <button
              onClick={changePassword}
              className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg">
              Update Password
            </button>
          </div>
        </div>

        {/* TOKENS LIST */}
        <div className="bg-white p-6 rounded-2xl shadow lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">📋 My Tokens</h2>

          {tokens.length === 0 ? (
            <p className="text-gray-500">No tokens booked yet.</p>
          ) : (
            <div className="space-y-4">
              {tokens.map(token => (
                <div
                  key={token.id}
                  className={`p-4 border rounded-xl flex flex-col md:flex-row md:justify-between md:items-center ${
                    token.status === "CANCELLED" ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex flex-col mb-2 md:mb-0">
                    <span className="font-semibold">
  {token.patientName || "Unknown Patient"}
</span>

                    <span className="text-gray-500">{token.reason}</span>
                  </div>

                  <div className="flex flex-col mb-2 md:mb-0">
                    <span className="text-gray-700">Time</span>
                    <span className="font-medium">
                      {new Date(token.tokenTime).toLocaleString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                      })}
                    </span>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-2">
                    <span className="text-gray-700 font-medium">Status: {token.status}</span>
                    {token.status === "BOOKED" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateTokenStatus(token.id, "COMPLETED")}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => updateTokenStatus(token.id, "CANCELLED")}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DoctorDashboard;
