import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import customaxios from "../../service/customAxios";
import CrowdStatusCard from "../../components/CrowdStatusCard";

const DistrictDashboardUser = () => {
  const { districtId } = useParams();
  const navigate = useNavigate();
  const [districtName, setDistrictName] = useState("");

  useEffect(() => {
    customaxios
      .get(`/admin/districts/${districtId}`)
      .then(res => setDistrictName(res.data.name));
  }, [districtId]);

  return (
    <div className="min-h-screen bg-[#f4f6f8]">

      {/* HEADER */}
      <header className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <img src={assets.Tamilnadu} className="h-12" alt="TN Govt" />
          <div>
            <h1 className="font-bold text-gray-800">
              Government of Tamil Nadu
            </h1>
            <p className="text-sm text-gray-600">
              {districtName} District – Public View
            </p>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        <h2 className="text-3xl font-semibold mb-8">
          {districtName} District Healthcare Services
        </h2>

        {/* 🔴 CROWD STATUS SECTION (NEW & IMPORTANT) */}
        <div className="mb-10">
          <CrowdStatusCard districtId={districtId} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* MEDICAL STOCK */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Medical Stock Availability
            </h3>
            <p className="text-gray-600 mt-2">
              View real-time availability of essential medicines across
              government hospitals.
            </p>

            <button
              onClick={() =>
                navigate(`/district/${districtId}/medical-stock`)
              }
              className="mt-6 w-full py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
            >
              View Medical Stock
            </button>
          </div>

          {/* BED AVAILABILITY */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Hospital Bed Availability
            </h3>
            <p className="text-gray-600 mt-2">
              Check ICU, General, and Emergency bed availability
              in government hospitals.
            </p>

            <button
              onClick={() =>
                navigate(`/district/${districtId}/beds`)
              }
              className="mt-6 w-full py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
            >
              View Bed Availability
            </button>
          </div>

          {/* DOCTORS */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Doctor Availability
            </h3>
            <p className="text-gray-600 mt-2">
              View on-duty government doctors by department and hospital.
            </p>

            <button
              onClick={() =>
                navigate(`/district/${districtId}/doctors`)
              }
              className="mt-6 w-full py-3 bg-green-700 text-white rounded-lg hover:bg-green-800"
            >
              View Available Doctors
            </button>
          </div>

          {/* TOKEN */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Token Management
            </h3>
            <p className="text-gray-600 mt-2">
              Book hospital tokens and avoid waiting in queues.
            </p>

            <button
              onClick={() => navigate(`/${districtId}/token-booking`)}
              className="mt-6 w-full py-3 bg-green-700 text-white rounded-lg hover:bg-green-800"
            >
              Book a Token
            </button>
          </div>

          {/* PUBLIC INFO */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Public Information
            </h3>
            <p className="text-gray-600 mt-2">
              Hospital locations, contact details, and public
              healthcare services.
            </p>

            <button
              className="mt-6 w-full py-3 rounded-lg border border-green-700 text-green-700 hover:bg-green-50 transition"
            >
              View Hospital Details
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default DistrictDashboardUser;
