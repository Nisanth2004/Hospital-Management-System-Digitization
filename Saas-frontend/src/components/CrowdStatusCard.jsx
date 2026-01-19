import React, { useEffect, useState } from "react";
import customaxios from "../service/customAxios";

const CrowdStatusCard = ({ districtId }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customaxios
      .get(`/public/crowd-status/${districtId}`)
      .then(res => {
        setStatus(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [districtId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow border p-6">
        <p className="text-gray-500">Loading crowd status...</p>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="bg-white rounded-xl shadow border p-6">
        <p className="text-red-600">Unable to fetch crowd data</p>
      </div>
    );
  }

  const crowdColor =
    status.crowdLevel === "LOW"
      ? "text-green-700 bg-green-50"
      : status.crowdLevel === "MODERATE"
      ? "text-yellow-700 bg-yellow-50"
      : "text-red-700 bg-red-50";

  return (
    <div className="bg-white rounded-xl shadow border p-6">
      <h3 className="text-xl font-semibold text-gray-800">
        Hospital Crowd Status
      </h3>

      <div className={`mt-4 p-4 rounded-lg ${crowdColor}`}>
        <p className="text-lg font-bold">
          Crowd Level: {status.crowdLevel}
        </p>
        <p className="text-sm mt-1">
          Estimated Waiting Time:{" "}
          <span className="font-semibold">
            {status.estimatedWaitTime} minutes
          </span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
        <div>
          👨‍⚕️ Doctors Available
          <p className="font-semibold">
            {status.availableDoctors} / {status.totalDoctors}
          </p>
        </div>

        <div>
          🛏 Beds Available
          <p className="font-semibold">
            {status.availableBeds} / {status.totalBeds}
          </p>
        </div>

        <div>
          🎫 Waiting Tokens
          <p className="font-semibold">{status.waitingTokens}</p>
        </div>

        <div>
          📊 Total Tokens Today
          <p className="font-semibold">{status.totalTokens}</p>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        * Crowd status is calculated using live token flow, doctor availability,
        and bed occupancy.
      </p>

      {/* 🕒 BEST TIME TO VISIT */}
{status.bestVisitTime?.startTime && (
  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
    <p className="text-sm text-blue-800 font-semibold">
      🕒 Best Time to Visit OPD
    </p>

    <p className="text-lg font-bold text-blue-900 mt-1">
      {status.bestVisitTime.startTime} – {status.bestVisitTime.endTime}
    </p>

    <p className="text-xs text-blue-700 mt-1">
      {status.bestVisitTime.reason}
    </p>
  </div>
)}

    </div>


  );
};

export default CrowdStatusCard;
