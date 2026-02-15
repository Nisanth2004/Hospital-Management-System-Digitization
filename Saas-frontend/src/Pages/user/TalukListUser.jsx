import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import customaxios from "../../service/customAxios";

const TalukListUser = () => {
  const { districtId } = useParams();
  const navigate = useNavigate();

  const [taluks, setTaluks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    customaxios
      .get(`/admin/taluks/district/${districtId}`)
      .then(res => setTaluks(res.data))
      .catch(err => console.error(err));
  }, [districtId]);

  // Filtered taluks
  const filteredTaluks = useMemo(() => {
    return taluks.filter(taluk =>
      taluk.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [taluks, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-12">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">
            Select Taluk
          </h2>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search taluk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
          />
        </div>

        {/* Taluk Grid */}
        {filteredTaluks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center text-gray-500">
            No taluks found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTaluks.map(taluk => (
              <div
                key={taluk.id}
                onClick={() =>
                  navigate(`/districts/${districtId}/taluk/${taluk.id}`)
                }
                className="cursor-pointer bg-white p-6 rounded-2xl shadow-sm border border-gray-200 
                           hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {taluk.name}
                  </h3>

                  <span className="text-sm text-green-600 font-medium">
                    View →
                  </span>
                </div>

                <p className="mt-3 text-sm text-gray-500">
                  Click to view hospitals and services.
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default TalukListUser;
