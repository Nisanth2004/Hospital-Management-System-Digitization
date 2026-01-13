import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import customaxios from "../../service/customAxios";
import { assets } from "../../assets/assets";

const DistrictDoctorListUser = () => {
  const { districtId } = useParams();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [lastUpdated, setLastUpdated] = useState(null);

  /* =========================
     FETCH DOCTORS
  ========================== */
  const fetchDoctors = async () => {
    try {
      const res = await customaxios.get(
        `/admin/doctors/public/district/${districtId}`
      );
      setDoctors(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch doctors", err);
    }
  };

  /* =========================
     INITIAL LOAD + AUTO REFRESH
  ========================== */
  useEffect(() => {
    fetchDoctors();

    const interval = setInterval(() => {
      fetchDoctors();
    }, 30000); // ⏱️ 30 seconds

    return () => clearInterval(interval);
  }, [districtId]);

  /* =========================
     FILTER LOGIC
  ========================== */
  const filteredDoctors = doctors.filter(d =>
    (departmentFilter === "ALL" || d.department === departmentFilter) &&
    (
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.hospitalName.toLowerCase().includes(search.toLowerCase())
    )
  );

  const departments = ["ALL", ...new Set(doctors.map(d => d.department))];

  return (
    <div className="min-h-screen bg-[#f4f7fb]">

      {/* ================= HEADER ================= */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <img src={assets.Tamilnadu} alt="TN Govt" className="h-12" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Government of Tamil Nadu
            </h1>
            <p className="text-sm text-gray-600">
              Public Doctor Availability – District {districtId}
            </p>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-green-700 text-sm font-medium"
        >
          ← Back to District Dashboard
        </button>

        {/* TITLE */}
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            Government Doctors
          </h2>
          <p className="text-gray-600 mt-1">
            Live doctor availability updates every 30 seconds
          </p>

          {lastUpdated && (
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* ================= FILTER BAR ================= */}
        <div className="sticky top-0 z-20 bg-white rounded-xl shadow p-5 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            type="text"
            placeholder="🔍 Search doctor or hospital"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-600 outline-none"
          />

          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-600 outline-none"
          >
            {departments.map(dep => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>

          <button
            onClick={fetchDoctors}
            className="bg-green-700 text-white rounded-lg py-3 text-sm hover:bg-green-800 transition"
          >
            🔄 Refresh Now
          </button>
        </div>

        {/* ================= DOCTOR CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {filteredDoctors.map(d => (
            <div
              key={d.id}
              className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition p-6"
            >
              {/* TOP */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Dr. {d.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {d.department}
                  </p>
                  <p className="text-sm text-gray-500">
                    {d.hospitalName}
                  </p>
                </div>

                {/* STATUS */}
                <span className={`px-4 py-2 rounded-full text-xs font-semibold
                  ${d.status === "AVAILABLE" && "bg-green-100 text-green-800"}
                  ${d.status === "BUSY" && "bg-orange-100 text-orange-800"}
                  ${d.status === "OFF_DUTY" && "bg-gray-200 text-gray-700"}
                `}>
                  {d.status === "AVAILABLE" && "🟢 Available"}
                  {d.status === "BUSY" && "🟠 Busy"}
                  {d.status === "OFF_DUTY" && "⚪ Off Duty"}
                </span>
              </div>

              {/* DETAILS */}
              <div className="text-sm text-gray-700 space-y-1">
                <p><b>Shift:</b> {d.shift}</p>
                <p><b>Timing:</b> {d.shiftStartTime} – {d.shiftEndTime}</p>
                <p><b>Ward:</b> {d.wardType}</p>
              </div>

              {/* WARNING */}
              {d.status !== "AVAILABLE" && (
                <p className="mt-3 text-xs text-red-600">
                  ⚠️ Doctor may not be available for immediate consultation
                </p>
              )}
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredDoctors.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            No doctors found for the selected filters
          </div>
        )}

      </main>
    </div>
  );
};

export default DistrictDoctorListUser;
