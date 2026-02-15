import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import customaxios from "../service/customAxios";
import Joyride, { STATUS } from "react-joyride";
import { motion, AnimatePresence } from "framer-motion";

const PatientNavigationPage = () => {
  const { districtId, talukId } = useParams();
  const imageRef = useRef(null);

  const [floors, setFloors] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [allEquipments, setAllEquipments] = useState([]);
  const [equipments, setEquipments] = useState([]);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [zoom, setZoom] = useState(1);

  const [runTour, setRunTour] = useState(true);

  // ================= TOUR STEPS =================
  const steps = [
    {
      target: ".search-box",
      content: "🔎 Search any room like ICU, Lab, CT Scan here.",
      disableBeacon: true,
    },
    {
      target: ".floor-section",
      content: "🏢 Select a floor to explore hospital layout.",
    },
    {
      target: ".map-section",
      content: "🗺️ Click markers to see room details.",
    },
    {
      target: ".zoom-controls",
      content: "🔍 Use zoom buttons to explore map closely.",
    },
  ];

  // ================= LOAD FLOORS =================
  useEffect(() => {
    customaxios
      .get(`/admin/navigation/floors?districtId=${districtId}&talukId=${talukId}`)
      .then(res => {
        setFloors(res.data);
        if (res.data.length > 0) {
          const ground =
            res.data.find(f => f.floorName.toLowerCase().includes("ground")) ||
            res.data[0];
          setSelectedFloor(ground);
          loadEquipments(ground.id);
        }
      });
  }, [districtId, talukId]);

  useEffect(() => {
    customaxios
      .get(`/admin/navigation/equipments?districtId=${districtId}&talukId=${talukId}`)
      .then(res => setAllEquipments(res.data));
  }, [districtId, talukId]);

  const loadEquipments = (floorId) => {
    customaxios
      .get(`/admin/navigation/equipments/${floorId}`)
      .then(res => setEquipments(res.data));
  };

  // ================= SEARCH =================
  useEffect(() => {
    if (!search) return setSuggestions([]);

    const normalized = search.toLowerCase().replace(/\s/g, "");
    const filtered = allEquipments.filter(eq => {
      const name = eq.name.toLowerCase().replace(/\s/g, "");
      const room = eq.roomNumber.toLowerCase();
      return name.includes(normalized) || room.includes(normalized);
    });

    setSuggestions(filtered.slice(0, 6));
  }, [search, allEquipments]);

  const selectLocation = (eq) => {
    setSelectedEquipment(eq);
    setSelectedFloor(eq.floor);
    setSearch(eq.name);
    setSuggestions([]);
    loadEquipments(eq.floor.id);
  };

  // ================= TOUR CALLBACK =================
  const handleJoyrideCallback = (data) => {
    const { status } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative">

      {/* ================= TOUR ================= */}
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        showSkipButton
        scrollToFirstStep
        disableScrolling
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: "#2563eb",
            overlayColor: "rgba(0,0,0,0.25)", // LIGHT DIM ONLY
            zIndex: 10000,
          },
          tooltip: {
            borderRadius: "12px",
            padding: "20px",
            fontSize: "15px",
          },
          buttonNext: {
            backgroundColor: "#2563eb",
          },
          buttonBack: {
            color: "#2563eb",
          },
        }}
      />

      <div className="p-6 max-w-7xl mx-auto">

        {/* HEADER */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 mb-8"
        >
          🏥 Smart Hospital Indoor Navigation
        </motion.h1>

        {/* SEARCH */}
        <div className="relative max-w-xl mb-10 search-box">
          <input
            type="text"
            placeholder="Search ICU, CT Scan, Lab..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-4 text-lg rounded-xl shadow-lg border border-gray-200 focus:ring-4 focus:ring-blue-200 outline-none"
          />

          {suggestions.length > 0 && (
            <div className="absolute w-full bg-white shadow-xl mt-2 rounded-xl border z-50">
              {suggestions.map(eq => (
                <div
                  key={eq.id}
                  onClick={() => selectLocation(eq)}
                  className="p-4 hover:bg-blue-50 cursor-pointer transition"
                >
                  <div className="font-semibold">{eq.name}</div>
                  <div className="text-sm text-gray-500">
                    {eq.floor.floorName} | Room {eq.roomNumber}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FLOORS */}
        <div className="flex gap-4 overflow-x-auto pb-6 floor-section">
          {floors.map(floor => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              key={floor.id}
              onClick={() => {
                setSelectedFloor(floor);
                loadEquipments(floor.id);
              }}
              className={`cursor-pointer min-w-[160px] rounded-xl overflow-hidden shadow-lg border-2 ${
                selectedFloor?.id === floor.id
                  ? "border-blue-600"
                  : "border-transparent"
              }`}
            >
              <img
                src={`http://localhost:8081/${floor.imageUrl}`}
                alt={floor.floorName}
                className="h-28 w-full object-cover"
              />
              <div className="text-center py-2 font-medium bg-white">
                {floor.floorName}
              </div>
            </motion.div>
          ))}
        </div>

        {/* MAP */}
        {selectedFloor && (
          <div className="map-section mt-6 bg-white rounded-2xl shadow-xl p-6">

            <div className="flex justify-end gap-3 mb-4 zoom-controls">
              <button
                onClick={() => setZoom(z => z + 0.2)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
              >
                +
              </button>
              <button
                onClick={() => setZoom(z => (z > 1 ? z - 0.2 : 1))}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                -
              </button>
            </div>

            <div className="relative overflow-auto">
              <div
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "top left",
                }}
                className="relative transition-transform duration-300"
              >
                <img
                  src={`http://localhost:8081/${selectedFloor.imageUrl}`}
                  alt="Floor Map"
                  className="max-w-4xl"
                />

                {equipments.map(eq => (
                  <motion.div
                    whileHover={{ scale: 1.4 }}
                    key={eq.id}
                    onClick={() => setSelectedEquipment(eq)}
                    className={`absolute w-6 h-6 rounded-full cursor-pointer shadow-lg ${
                      selectedEquipment?.id === eq.id
                        ? "bg-red-600"
                        : "bg-blue-600"
                    }`}
                    style={{
                      top: `${eq.positionY}%`,
                      left: `${eq.positionX}%`,
                      transform: "translate(-50%, -50%)"
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* SHOW GUIDE BUTTON */}
      {!runTour && (
        <button
          onClick={() => setRunTour(true)}
          className="fixed bottom-6 left-6 bg-blue-600 text-white px-5 py-3 rounded-full shadow-xl hover:bg-blue-700 transition"
        >
          🎯 Show Guide
        </button>
      )}
    </div>
  );
};

export default PatientNavigationPage;
