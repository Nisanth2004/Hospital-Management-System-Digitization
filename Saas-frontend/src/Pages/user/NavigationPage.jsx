import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import customaxios from "../../service/customAxios";

const NavigationPage = () => {
  const { districtId, talukId } = useParams();
  const imageRef = useRef(null);

  const [floors, setFloors] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [equipments, setEquipments] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [zoom, setZoom] = useState(1);

  // ================= LOAD FLOORS =================
  useEffect(() => {
    customaxios
      .get(`/admin/navigation/floors?districtId=${districtId}&talukId=${talukId}`)
      .then(res => setFloors(res.data))
      .catch(err => console.error(err));
  }, [districtId, talukId]);

  // ================= LOAD EQUIPMENTS =================
  const loadEquipments = async (floor) => {
    setSelectedFloor(floor);
    setSearchResult(null);

    try {
      const res = await customaxios.get(
        `/admin/navigation/equipments/${floor.id}`
      );
      setEquipments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= SEARCH =================
  const handleSearch = async () => {
    if (!search.trim()) return;

    setLoading(true);

    try {
      const res = await customaxios.get(
        `/admin/navigation/search?query=${search}`
      );

      if (res.data.length > 0) {
        const equipment = res.data[0];

        setSearchResult(equipment);
        setSelectedFloor(equipment.floor);

        const eqRes = await customaxios.get(
          `/admin/navigation/equipments/${equipment.floor.id}`
        );
        setEquipments(eqRes.data);

        setTimeout(() => {
          imageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      } else {
        alert("No equipment found");
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const clearSearch = () => {
    setSearch("");
    setSearchResult(null);
  };

  const zoomIn = () => setZoom(prev => prev + 0.2);
  const zoomOut = () => setZoom(prev => (prev > 1 ? prev - 0.2 : 1));

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen">

      {/* HEADER */}
      <h2 className="text-4xl font-extrabold mb-8 text-blue-800 text-center">
        🏥 Hospital Indoor Navigation
      </h2>

      {/* SEARCH SECTION */}
      <div className="mb-8 flex gap-3 max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Search ICU, CT Scan, Lab..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 p-4 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSearch}
          className="px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition"
        >
          {loading ? "Searching..." : "Search"}
        </button>

        {searchResult && (
          <button
            onClick={clearSearch}
            className="px-6 bg-gray-500 hover:bg-gray-600 text-white rounded-xl"
          >
            Clear
          </button>
        )}
      </div>

      {/* FLOOR SELECT */}
      <div className="flex gap-4 flex-wrap justify-center mb-6">
        {floors.map(floor => (
          <button
            key={floor.id}
            onClick={() => loadEquipments(floor)}
            className={`px-6 py-3 rounded-full font-semibold shadow transition ${
              selectedFloor?.id === floor.id
                ? "bg-green-700 text-white scale-105"
                : "bg-white hover:bg-blue-100"
            }`}
          >
            {floor.floorName}
          </button>
        ))}
      </div>

      {/* FLOOR MAP */}
      {selectedFloor && (
        <div className="flex justify-center relative">
          
          {/* Zoom Controls */}
          <div className="absolute right-10 top-5 z-10 flex flex-col gap-3">
            <button onClick={zoomIn} className="bg-white shadow p-3 rounded-full text-lg">➕</button>
            <button onClick={zoomOut} className="bg-white shadow p-3 rounded-full text-lg">➖</button>
          </div>

          <div
            ref={imageRef}
            className="relative border rounded-2xl shadow-2xl bg-white overflow-auto max-w-5xl"
          >
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top left"
              }}
            >
              <img
                src={`http://localhost:8081/${selectedFloor.imageUrl}`}
                alt="Floor"
                className="w-full h-auto object-contain"
              />

              {(searchResult ? [searchResult] : equipments).map(eq => (
                <div
                  key={eq.id}
                  className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer ${
                    searchResult?.id === eq.id
                      ? "bg-red-600 animate-pulse scale-125"
                      : "bg-blue-600 hover:scale-110"
                  }`}
                  style={{
                    top: `${eq.positionY}%`,
                    left: `${eq.positionX}%`,
                    transform: "translate(-50%, -50%)"
                  }}
                  title={`${eq.name} - Room ${eq.roomNumber}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RESULT DETAILS */}
      {searchResult && (
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-xl max-w-3xl mx-auto border-l-4 border-red-500">
          <h3 className="text-2xl font-bold mb-3 text-red-600">
            📍 Location Found
          </h3>

          <p><strong>Equipment:</strong> {searchResult.name}</p>
          <p><strong>Room:</strong> {searchResult.roomNumber}</p>
          <p><strong>Floor:</strong> {searchResult.floor.floorName}</p>

          <p className="text-sm text-gray-600 mt-3">
            The blinking red dot shows the exact location on the map.
          </p>
        </div>
      )}
    </div>
  );
};

export default NavigationPage;
