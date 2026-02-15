import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import api from "../services/api";

const DistrictDashboard = () => {
  const { districtId } = useParams();
  const navigate = useNavigate();

  const [taluks, setTaluks] = useState([]);
  const [selectedTaluk, setSelectedTaluk] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch taluks
  useEffect(() => {
    api.get(`/taluks/district/${districtId}`)
      .then((res) => setTaluks(res.data))
      .catch((err) => console.error(err));
  }, [districtId]);

  // Filter taluks by search
  const filteredTaluks = useMemo(() => {
    return taluks.filter((taluk) =>
      taluk.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [taluks, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

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

        {/* ===== Taluk Selection Section ===== */}
        <div className="mb-14">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Select Taluk
            </h2>

            {/* Search Box */}
            <input
              type="text"
              placeholder="Search taluk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-72 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
            />
          </div>

          {filteredTaluks.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center text-gray-500">
              No taluks found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTaluks.map((taluk) => (
                <div
                  key={taluk.id}
                  onClick={() => setSelectedTaluk(taluk)}
                  className={`cursor-pointer rounded-xl p-6 transition-all duration-300
                    ${
                      selectedTaluk?.id === taluk.id
                        ? "bg-green-600 text-white shadow-xl scale-105"
                        : "bg-white border border-gray-200 hover:shadow-lg hover:-translate-y-1"
                    }`}
                >
                  <h3 className="text-lg font-semibold">
                    {taluk.name}
                  </h3>

                  {selectedTaluk?.id === taluk.id && (
                    <p className="text-sm mt-2 opacity-90">
                      Selected Taluk
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== Show Modules ONLY after Taluk selected ===== */}
        {selectedTaluk && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-gray-800">
                Taluk Dashboard – {selectedTaluk.name}
              </h2>
              <p className="mt-2 text-gray-600">
                Manage hospital services for this taluk.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* Medical Stock */}
              <div
                onClick={() =>
                  navigate(`/district/${districtId}/taluk/${selectedTaluk.id}/medical-stock`)
                }
                className="cursor-pointer rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="border-b bg-gray-50 px-6 py-4 rounded-t-xl">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Medical Stock Management
                  </h3>
                </div>
                <div className="px-6 py-6">
                  <p className="text-gray-600">
                    Add, update, and monitor medicine stock.
                  </p>
                  <button className="mt-6 w-full py-2.5 rounded-lg bg-green-700 text-white hover:bg-green-800 transition">
                    Open Module
                  </button>
                </div>
              </div>

              {/* Bed Management */}
              <div
                onClick={() =>
                  navigate(`/district/${districtId}/taluk/${selectedTaluk.id}/bed-management`)
                }
                className="cursor-pointer rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="border-b bg-blue-50 px-6 py-4 rounded-t-xl">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Bed Management
                  </h3>
                </div>
                <div className="px-6 py-6">
                  <p className="text-gray-600">
                    Monitor hospital bed availability.
                  </p>
                  <button className="mt-6 w-full py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition">
                    Open Module
                  </button>
                </div>
              </div>

              {/* Doctor Management */}
              <div
                onClick={() =>
                  navigate(`/district/${districtId}/taluk/${selectedTaluk.id}/doctor-management`)
                }
                className="cursor-pointer rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="border-b bg-purple-50 px-6 py-4 rounded-t-xl">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Doctor Management
                  </h3>
                </div>
                <div className="px-6 py-6">
                  <p className="text-gray-600">
                    Manage doctor availability & schedules.
                  </p>
                  <button className="mt-6 w-full py-2.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition">
                    Open Module
                  </button>
                </div>
              </div>

              {/* Complaint Management */}
              <div
                onClick={() =>
                  navigate(`/district/${districtId}/taluk/${selectedTaluk.id}/complaints`)
                }
                className="cursor-pointer rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="border-b bg-red-50 px-6 py-4 rounded-t-xl">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Complaint Management
                  </h3>
                </div>
                <div className="px-6 py-6">
                  <p className="text-gray-600">
                    View and manage public complaints.
                  </p>
                  <button className="mt-6 w-full py-2.5 bg-red-700 text-white rounded-lg hover:bg-red-800 transition">
                    Open Module
                  </button>
                </div>
              </div>

              {/* Indoor Navigation Management */}
<div
  onClick={() =>
    navigate(`/district/${districtId}/taluk/${selectedTaluk.id}/admin-navigation`)
  }
  className="cursor-pointer rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all"
>
  <div className="border-b bg-indigo-50 px-6 py-4 rounded-t-xl">
    <h3 className="text-xl font-semibold text-gray-800">
      Indoor Navigation Management
    </h3>
  </div>
  <div className="px-6 py-6">
    <p className="text-gray-600">
      Manage floor maps and mark CT Scan, ICU, Lab,
      Pharmacy and other equipment locations.
    </p>
    <button className="mt-6 w-full py-2.5 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition">
      Open Module
    </button>
  </div>
</div>


            </div>
          </>
        )}
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Government of Tamil Nadu
        </div>
      </footer>
    </div>
  );
};

export default DistrictDashboard;
