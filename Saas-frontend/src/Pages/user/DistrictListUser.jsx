import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { fetchDistricts } from "../../service/DistrictService";

const DistrictListUser = () => {
  const navigate = useNavigate();

  const [districts, setDistricts] = useState([]);
  const [search, setSearch] = useState("");
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

  // 🔍 Search filter
  const filteredDistricts = districts.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4f6f8]">

      {/* HEADER */}
      <header className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <img src={assets.Tamilnadu} className="h-12" alt="Tamil Nadu Govt" />
          <div>
            <h1 className="font-bold text-gray-900">
              Government of Tamil Nadu
            </h1>
            <p className="text-sm text-gray-600">
              Public Healthcare Information Portal
            </p>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* TITLE + INFO */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800">
            Select Your District
          </h2>
          <p className="text-gray-600 mt-2 max-w-3xl">
            Choose your district to view <b>government hospitals</b>,
            <b> doctor availability</b>, <b>bed status</b>, and
            <b> medical stock information</b>.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-white p-5 rounded-xl shadow mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🔍 Search District
          </label>

          <input
            type="text"
            placeholder="Type your district name (eg: Chennai, Madurai)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="
              w-full md:w-1/2 border rounded-lg px-4 py-3 text-sm
              focus:outline-none focus:ring-2 focus:ring-green-700
            "
          />

          <p className="text-xs text-gray-500 mt-2">
            Showing {filteredDistricts.length} of {districts.length} districts
          </p>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="text-center text-gray-500 py-10">
            Loading districts, please wait...
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredDistricts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-gray-600">
              😕 No district found for "<b>{search}</b>"
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Please check the spelling or try another district name
            </p>
          </div>
        )}

        {/* DISTRICT CARDS */}
        {!loading && filteredDistricts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {filteredDistricts.map((district) => (
              <div
                key={district.id}
                onClick={() => navigate(`/districts/${district.id}`)}
                className="
                  cursor-pointer bg-white rounded-xl p-6
                  border shadow-sm hover:shadow-lg hover:border-green-600
                  transition group
                "
              >
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-green-700">
                  {district.name}
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  View hospitals, doctors, beds & medicines
                </p>

                <div className="mt-4 text-green-700 text-sm font-medium">
                  View Details →
                </div>
              </div>
            ))}

          </div>
        )}

        {/* FOOT NOTE */}
        <div className="mt-16 text-center text-xs text-gray-500">
          This portal provides real-time government healthcare information
          for public awareness and emergency planning.
        </div>

      </main>
    </div>
  );
};

export default DistrictListUser;
