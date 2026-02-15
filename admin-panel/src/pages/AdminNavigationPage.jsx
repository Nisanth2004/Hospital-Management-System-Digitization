import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const AdminNavigationPage = () => {
  const { districtId, talukId } = useParams();
  const imageRef = useRef(null);

  const [floors, setFloors] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [equipments, setEquipments] = useState([]);

  const [floorName, setFloorName] = useState("");
  const [floorImage, setFloorImage] = useState(null);

  const [equipmentName, setEquipmentName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [position, setPosition] = useState({ x: null, y: null });

  // ================= LOAD FLOORS =================
  const fetchFloors = () => {
    api
      .get(`/navigation/floors?districtId=${districtId}&talukId=${talukId}`)
      .then((res) => setFloors(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (districtId && talukId) {
      fetchFloors();
    }
  }, [districtId, talukId]);

  // ================= CREATE FLOOR =================
  const createFloor = () => {
    if (!floorName || !floorImage) {
      alert("Enter floor name and select image");
      return;
    }

    const formData = new FormData();
    formData.append("floorName", floorName);
    formData.append("districtId", districtId);
    formData.append("talukId", talukId);
    formData.append("image", floorImage);

    api.post("/navigation/admin/floor", formData).then(() => {
      setFloorName("");
      setFloorImage(null);
      fetchFloors();
    });
  };

  // ================= LOAD EQUIPMENT =================
  const loadEquipments = (floor) => {
    setSelectedFloor(floor);
    api
      .get(`/navigation/equipments/${floor.id}`)
      .then((res) => setEquipments(res.data));
  };

  // ================= IMAGE CLICK =================
  const handleImageClick = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  // ================= SAVE EQUIPMENT =================
  const saveEquipment = () => {
    if (!equipmentName || !roomNumber || position.x === null) {
      alert("Fill all details and click map");
      return;
    }

    api.post("/navigation/admin/equipment", {
      name: equipmentName,
      roomNumber,
      positionX: position.x,
      positionY: position.y,
      floor: { id: selectedFloor.id },
    }).then(() => {
      setEquipmentName("");
      setRoomNumber("");
      setPosition({ x: null, y: null });
      loadEquipments(selectedFloor);
    });
  };

  const deleteEquipment = (id) => {
    api.delete(`/navigation/admin/equipment/${id}`)
      .then(() => loadEquipments(selectedFloor));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Indoor Navigation Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage hospital floor maps and medical equipment locations.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-sm text-gray-500">Total Floors</h3>
          <p className="text-2xl font-bold text-blue-700">{floors.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-sm text-gray-500">Selected Floor</h3>
          <p className="text-2xl font-bold text-green-700">
            {selectedFloor ? selectedFloor.floorName : "None"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-sm text-gray-500">Equipments</h3>
          <p className="text-2xl font-bold text-red-600">{equipments.length}</p>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT PANEL */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">

          <h2 className="text-xl font-semibold mb-6 border-b pb-2">
            Create New Floor
          </h2>

          <input
            type="text"
            placeholder="Enter Floor Name"
            value={floorName}
            onChange={(e) => setFloorName(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFloorImage(e.target.files[0])}
            className="w-full mb-4"
          />

          <button
            onClick={createFloor}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
          >
            Add Floor
          </button>

          {/* FLOOR LIST */}
          <h2 className="text-xl font-semibold mt-8 mb-4 border-b pb-2">
            Floors
          </h2>

          {floors.length === 0 && (
            <p className="text-gray-500 text-sm">No floors available.</p>
          )}

          <div className="space-y-3">
            {floors.map((floor) => (
              <button
                key={floor.id}
                onClick={() => loadEquipments(floor)}
                className={`w-full p-3 rounded-lg text-left transition ${
                  selectedFloor?.id === floor.id
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {floor.floorName}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-2">

          {selectedFloor ? (
            <>
              {/* MAP CONTAINER */}
              <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  {selectedFloor.floorName} - Floor Map
                </h2>

                <div className="relative border rounded-xl overflow-hidden">
                  <img
                    ref={imageRef}
                    src={
                      selectedFloor.imageUrl.startsWith("http")
                        ? selectedFloor.imageUrl
                        : `http://localhost:8081/${selectedFloor.imageUrl}`
                    }
                    alt="Floor"
                    className="w-full cursor-crosshair"
                    onClick={handleImageClick}
                  />

                  {equipments.map((eq) => (
                    <div
                      key={eq.id}
                      onClick={() => deleteEquipment(eq.id)}
                      title={`${eq.name} - Room ${eq.roomNumber}`}
                      className="absolute w-5 h-5 bg-red-600 rounded-full cursor-pointer hover:scale-125 transition"
                      style={{
                        top: `${eq.positionY}%`,
                        left: `${eq.positionX}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  ))}

                  {position.x !== null && (
                    <div
                      className="absolute w-5 h-5 bg-blue-600 rounded-full"
                      style={{
                        top: `${position.y}%`,
                        left: `${position.x}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  )}
                </div>
              </div>

              {/* ADD EQUIPMENT */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                  Add Equipment
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Equipment Name"
                    value={equipmentName}
                    onChange={(e) => setEquipmentName(e.target.value)}
                    className="p-3 border rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="Room Number"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="p-3 border rounded-lg"
                  />
                </div>

                <p className="text-sm mt-4 text-gray-600">
                  Selected Position:
                  {position.x !== null
                    ? ` ${position.x.toFixed(2)}%, ${position.y.toFixed(2)}%`
                    : " Click on map"}
                </p>

                <button
                  onClick={saveEquipment}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition"
                >
                  Save Equipment
                </button>
              </div>
            </>
          ) : (
            <div className="bg-white p-10 rounded-2xl shadow-lg text-center text-gray-500">
              Select a floor to manage equipment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNavigationPage;
