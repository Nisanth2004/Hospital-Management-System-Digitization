import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TokenDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, doctor } = location.state || {};

  if (!token || !doctor) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl mt-10 text-center">
        <h2 className="text-xl font-bold">No token information available</h2>
        <button onClick={() => navigate("/token-booking")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Booked Token</h2>
      <div className="space-y-3">
        <p><strong>Doctor:</strong> {doctor.name} ({doctor.hospitalName})</p>
        <p><strong>Department:</strong> {doctor.department}</p>
        <p><strong>Token Time:</strong> {new Date(token.tokenTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
        <p><strong>Reason:</strong> {token.reason}</p>
        <p><strong>Status:</strong> {token.status}</p>
      </div>
      <button onClick={() => navigate("/token-booking")} className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Book Another Token</button>
    </div>
  );
};

export default TokenDetails;
