import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";


const DistrictDashboard = () => {
  const { districtId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      
      {/* ===== Header ===== */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <img
            src={assets.Tamilnadu}
            alt="Tamil Nadu Government"
            className="h-12 w-18"
          />
          <div>
            <h1 className="text-lg font-bold text-gray-800">
              Government of Tamil Nadu
            </h1>
            <p className="text-sm text-gray-600">
              District Administration Panel
            </p>
          </div>
        </div>
      </header>

      {/* ===== Page Content ===== */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Title */}
        <div className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-800">
            District Dashboard
          </h2>
          <p className="mt-2 text-gray-600">
            Manage government hospital services for this district.
          </p>
        </div>

        {/* ===== Feature Cards ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Medical Stock */}
          <div
            onClick={() => navigate(`/district/${districtId}/medical-stock`)}
            className="
              cursor-pointer rounded-xl bg-white
              border border-gray-200 shadow-sm
              hover:shadow-lg transition-all duration-300
            "
          >
            <div className="border-b bg-gray-50 px-6 py-4 rounded-t-xl">
              <h3 className="text-xl font-semibold text-gray-800">
                Medical Stock Management
              </h3>
              <p className="text-sm text-gray-500">
                Essential medicines & inventory
              </p>
            </div>

            <div className="px-6 py-6">
              <p className="text-gray-600 leading-relaxed">
                Add, update, and monitor medicine stock availability
                across government hospitals in this district.
              </p>

              <button className="
                mt-6 w-full py-2.5 rounded-lg
                bg-green-700 text-white font-medium
                hover:bg-green-800 transition
              ">
                Open Module
              </button>
            </div>
          </div>

{/* Bed Management */}
<div
  onClick={() => navigate(`/district/${districtId}/bed-management`)}
  className="
    cursor-pointer rounded-xl bg-white
    border border-gray-200 shadow-sm
    hover:shadow-lg transition-all
  "
>
  <div className="border-b bg-blue-50 px-6 py-4 rounded-t-xl">
    <h3 className="text-xl font-semibold text-gray-800">
      Bed Management
    </h3>
    <p className="text-sm text-gray-500">
      Hospital bed availability
    </p>
  </div>

  <div className="px-6 py-6">
    <p className="text-gray-600">
      Add, update and monitor hospital beds
      across wards in this district.
    </p>

    <button className="mt-6 w-full py-2.5 bg-blue-700 text-white rounded-lg">
      Open Module
    </button>
  </div>
</div>

          {/* Future Feature – Doctors */}
          <div className="
            rounded-xl bg-white border border-gray-200
            opacity-60 cursor-not-allowed
          ">
            <div className="border-b bg-gray-50 px-6 py-4 rounded-t-xl">
              <h3 className="text-xl font-semibold text-gray-800">
                Doctors & Staff
              </h3>
              <p className="text-sm text-gray-500">
                Human resource management
              </p>
            </div>

            <div className="px-6 py-6">
              <p className="text-gray-600">
                Manage doctor postings, staff records, and shifts.
              </p>

              <button className="
                mt-6 w-full py-2.5 rounded-lg
                bg-gray-300 text-gray-600 font-medium
                cursor-not-allowed
              ">
                Coming Soon
              </button>
            </div>
          </div>

          {/* Future Feature – Reports */}
          <div className="
            rounded-xl bg-white border border-gray-200
            opacity-60 cursor-not-allowed
          ">
            <div className="border-b bg-gray-50 px-6 py-4 rounded-t-xl">
              <h3 className="text-xl font-semibold text-gray-800">
                Reports & Analytics
              </h3>
              <p className="text-sm text-gray-500">
                District health insights
              </p>
            </div>

            <div className="px-6 py-6">
              <p className="text-gray-600">
                View usage statistics, stock reports,
                and healthcare performance metrics.
              </p>

              <button className="
                mt-6 w-full py-2.5 rounded-lg
                bg-gray-300 text-gray-600 font-medium
                cursor-not-allowed
              ">
                Coming Soon
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* ===== Footer ===== */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Government of Tamil Nadu · District Dashboard
        </div>
      </footer>
    </div>
  );
};

export default DistrictDashboard;
