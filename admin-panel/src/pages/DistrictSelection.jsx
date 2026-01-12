import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";


const DistrictSelection = () => {
  const [districts, setDistricts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/districts")
      .then(res => setDistricts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      
      {/* ===== Government Header ===== */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <img
            src={assets.Tamilnadu}
            alt="Tamil Nadu Government"
            className="h-14 w-18"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Government of Tamil Nadu
            </h1>
            <p className="text-sm text-gray-600">
              Directorate of Government Hospitals
            </p>
          </div>
        </div>
      </header>

      {/* ===== Page Title ===== */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-800">
            District Administration Dashboard
          </h2>
          <p className="mt-2 text-gray-600">
            Select a district to manage government hospital services and medical resources.
          </p>
        </div>

        {/* ===== District Cards ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {districts.map((d) => (
            <div
              key={d.id}
              onClick={() => navigate(`/district/${d.id}`)}
              className="
                cursor-pointer rounded-xl bg-white
                border border-gray-200
                shadow-sm hover:shadow-lg
                transition-all duration-300
              "
            >
              {/* Card Header */}
              <div className="border-b px-6 py-4 bg-gray-50 rounded-t-xl">
                <h3 className="text-xl font-semibold text-gray-800">
                  {d.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Government Hospitals
                </p>
              </div>

              {/* Card Body */}
              <div className="px-6 py-6">
                <p className="text-gray-600 leading-relaxed">
                  Manage medical stock, hospital facilities, and
                  healthcare services for this district.
                </p>

                <button
                  className="
                    mt-6 w-full py-2.5
                    bg-green-700 text-white
                    rounded-lg font-medium
                    hover:bg-green-800 transition
                  "
                >
                  Open District Dashboard
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ===== Empty State ===== */}
        {districts.length === 0 && (
          <div className="text-center py-24 text-gray-500">
            <p className="text-lg">
              No districts available.
            </p>
            <p className="text-sm mt-2">
              Please add districts from the admin database.
            </p>
          </div>
        )}
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Government of Tamil Nadu · Hospital Digitalization System
        </div>
      </footer>
    </div>
  );
};

export default DistrictSelection;
