import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import customaxios from "../../service/customAxios";
import { assets } from "../../assets/assets";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { useRef } from "react";
const WARD_TYPES = ["ALL", "ICU", "General", "Emergency"];
const BED_TYPES = ["ALL", "Oxygen", "Ventilator", "Normal"];

const BedAvailabilityUser = () => {
  const { districtId } = useParams();

  const [beds, setBeds] = useState([]);
  const [wardFilter, setWardFilter] = useState("ALL");
  const [bedTypeFilter, setBedTypeFilter] = useState("ALL");
  const [hospitalFilter, setHospitalFilter] = useState("");

const stompClientRef = useRef(null);
const [wsConnected, setWsConnected] = useState(false);



useEffect(() => {
  const socket = new SockJS("http://localhost:8080/ws");
  const client = over(socket);

  client.connect(
    {},
    () => {
      console.log("✅ WebSocket connected");
      stompClientRef.current = client;
      setWsConnected(true);
    },
    (error) => {
      console.error("❌ WebSocket error", error);
      setWsConnected(false);
    }
  );

  return () => {
    if (client && client.connected) {
      client.disconnect(() => {
        console.log("🔌 WebSocket disconnected");
      });
    }
  };
}, []);


  // 🔔 Notify modal
  const [notifyBed, setNotifyBed] = useState(null);
 const [email, setEmail] = useState("");


  // ⏱ force re-render every minute for countdown
  const [, forceTick] = useState(0);

  useEffect(() => {
    customaxios
      .get(`/public/beds/${districtId}`)
      .then(res => setBeds(res.data))
      .catch(console.error);
  }, [districtId]);

  useEffect(() => {
    const timer = setInterval(() => {
      forceTick(t => t + 1);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  /* ================= FILTER LOGIC ================= */

  const filteredBeds = useMemo(() => {
    return beds.filter(bed => {
      if (wardFilter !== "ALL" && bed.wardType !== wardFilter) return false;
      if (bedTypeFilter !== "ALL" && bed.bedType !== bedTypeFilter) return false;
      if (
        hospitalFilter &&
        !bed.hospitalName.toLowerCase().includes(hospitalFilter.toLowerCase())
      ) return false;
      return true;
    });
  }, [beds, wardFilter, bedTypeFilter, hospitalFilter]);

  /* ================= GROUP BY WARD ================= */

  const groupedByWard = useMemo(() => {
    return filteredBeds.reduce((acc, bed) => {
      acc[bed.wardType] = acc[bed.wardType] || [];
      acc[bed.wardType].push(bed);
      return acc;
    }, {});
  }, [filteredBeds]);

  /* ================= HELPERS ================= */

  const getCountdown = (date) => {
    const diff = new Date(date) - new Date();
    if (diff <= 0) return "Any time now";

    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;

    return `${hrs}h ${remMins}m`;
  };

 const submitNotify = async () => {
  await customaxios.post("/public/notifications/subscribe", {
    bedId: notifyBed.id,
    email
  });

  const client = stompClientRef.current;

  if (!client || !client.connected) {
    alert("❌ WebSocket not connected. Please refresh.");
    return;
  }

  client.subscribe(
    `/topic/bed/${notifyBed.id}`,
    (msg) => {
      alert("🔔 " + msg.body);
    }
  );

  alert("✅ You will be notified when bed is free");

  setNotifyBed(null);
  setEmail("");
};





  return (
    <div className="min-h-screen bg-[#f4f6f8] px-6 py-10">

      <h2 className="text-3xl font-semibold mb-2">
        Government Hospital Bed Availability
      </h2>
      <p className="text-gray-600 mb-8">
        Live status of beds across hospitals in your district
      </p>

      {/* FILTER BAR */}
      <div className="bg-white rounded-xl shadow p-4 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">

        <FilterSelect label="Ward Type" value={wardFilter} options={WARD_TYPES} onChange={setWardFilter} />
        <FilterSelect label="Bed Type" value={bedTypeFilter} options={BED_TYPES} onChange={setBedTypeFilter} />

        <div>
          <label className="text-sm text-gray-600">Hospital Name</label>
          <input
            className="w-full border rounded px-3 py-2 mt-1"
            value={hospitalFilter}
            onChange={e => setHospitalFilter(e.target.value)}
            placeholder="Search hospital"
          />
        </div>

        <button
          onClick={() => {
            setWardFilter("ALL");
            setBedTypeFilter("ALL");
            setHospitalFilter("");
          }}
          className="self-end bg-gray-200 rounded-lg py-2"
        >
          Reset
        </button>
      </div>

      {/* WARDS */}
      {Object.keys(groupedByWard).map(ward => (
        <div key={ward} className="mb-12">

          <h3 className="text-2xl font-semibold mb-4">{ward} Ward</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">

            {groupedByWard[ward].map(bed => (
              <div
                key={bed.id}
                className={`rounded-xl shadow p-4 text-center
                  ${bed.occupied ? "bg-red-100" : "bg-green-100"}
                `}
              >
                <img src={assets.bed} className="w-20 mx-auto mb-3" />

                <h4 className="font-bold">{bed.bedNumber}</h4>
                <p className="text-sm">{bed.bedType}</p>
                <p className="text-xs text-gray-500">{bed.hospitalName}</p>

                {!bed.occupied && (
                  <p className="mt-3 font-semibold text-green-700">
                    ✅ Available Now
                  </p>
                )}

                {bed.occupied && bed.expectedDischarge && (
                  <>
                    <p className="mt-3 text-orange-700 font-semibold text-sm">
                      ⏳ Expected in {getCountdown(bed.expectedDischarge)}
                    </p>
          <button
  disabled={!wsConnected}
  onClick={() => setNotifyBed(bed)}
  className={`mt-2 text-xs px-3 py-1 rounded
    ${wsConnected ? "bg-orange-600 text-white" : "bg-gray-400 text-gray-700"}
  `}
>
  
</button>


                  </>
                )}

                {bed.occupied && !bed.expectedDischarge && (
                  <p className="mt-3 text-red-700 font-semibold text-sm">
                    ❌ Currently Occupied
                  </p>
                )}
              </div>
            ))}

          </div>
        </div>
      ))}

      {/* 🔔 NOTIFY MODAL */}
      {notifyBed && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[360px] shadow-xl">

            <h3 className="text-xl font-bold mb-2">
              Notify When Available
            </h3>

            <p className="text-sm mb-4">
              Bed <b>{notifyBed.bedNumber}</b> – {notifyBed.hospitalName}
            </p>

           <input
  type="email"
  placeholder="Enter email"
  value={email}
  onChange={e => setEmail(e.target.value)}
/>


            <div className="flex gap-3 mt-5">
              <button
                onClick={submitNotify}
                className="flex-1 bg-green-700 text-white py-2 rounded"
              >
                Confirm
              </button>
              <button
                onClick={() => setNotifyBed(null)}
                className="flex-1 bg-gray-300 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

/* ================= COMPONENTS ================= */

const FilterSelect = ({ label, value, options, onChange }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <select
      className="w-full border rounded px-3 py-2 mt-1"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default BedAvailabilityUser;
