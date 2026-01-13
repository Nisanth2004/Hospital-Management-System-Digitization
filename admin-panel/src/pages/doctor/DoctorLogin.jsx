import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const DoctorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    try {
      setLoading(true);
      const res = await api.post("/doctor/login", { email, password });
      localStorage.setItem("doctor", JSON.stringify(res.data));
      navigate("/doctor/dashboard");
    } catch (err) {
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">
            Government Hospital Portal
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Doctor Secure Login
          </p>
        </div>

        {/* INFO */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded mb-6 text-sm text-gray-700">
          <p>
            🔒 This portal is strictly for authorized government doctors.
            Please log in using your official credentials.
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Official Email Address
            </label>
            <input
              type="email"
              placeholder="doctor@gov.in"
              className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Login to Dashboard"}
          </button>
        </div>

        {/* FOOTER */}
        <div className="text-xs text-gray-500 mt-6 text-center">
          © Government Health Department  
          <br />
          Unauthorized access is prohibited
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
