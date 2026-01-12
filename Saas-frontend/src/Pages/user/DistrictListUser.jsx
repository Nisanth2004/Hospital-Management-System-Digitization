import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { fetchDistricts } from "../../service/DistrictService";

const DistrictListUser = () => {
  const navigate = useNavigate();
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const data = await fetchDistricts();
        setDistricts(data);
      } catch (error) {
        console.error("Failed to fetch districts", error);
      } finally {
        setLoading(false);
      }
    };

    loadDistricts();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f6f8]">

      {/* HEADER */}
      <header className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <img src={assets.Tamilnadu} className="h-12" />
          <div>
            <h1 className="font-bold text-gray-800">
              Government of Tamil Nadu
            </h1>
            <p className="text-sm text-gray-600">
              District-wise Hospital Information
            </p>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-semibold mb-8">
          Select Your District
        </h2>

        {loading && (
          <p className="text-center text-gray-500">Loading districts...</p>
        )}

        {!loading && districts.length === 0 && (
          <p className="text-center text-gray-500">No districts found</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {districts.map((district) => (
            <div
              key={district.id}
              onClick={() => navigate(`/districts/${district.id}`)}
              className="
                cursor-pointer bg-white rounded-xl p-6
                border shadow-sm hover:shadow-lg transition
              "
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {district.name}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                View hospital & medical stock info
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DistrictListUser;
