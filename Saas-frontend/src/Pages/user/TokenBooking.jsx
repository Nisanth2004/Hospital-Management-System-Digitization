import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import customaxios from "../../service/customAxios";

const TokenBooking = () => {

  // ✅ GET districtId FROM URL
  const { districtId } = useParams();
const [taluks, setTaluks] = useState([]);
const [selectedTaluk, setSelectedTaluk] = useState("");

  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [reason, setReason] = useState("");
  const [patientId] = useState(1); // demo

  const navigate = useNavigate();

  /* =========================
     LOAD DEPARTMENTS
  ========================= */
  useEffect(() => {
    customaxios
      .get("/admin/doctors/public/departments")
      .then(res => setDepartments(res.data))
      .catch(err => console.error(err));
  }, []);
useEffect(() => {
  if (!districtId) return;

  customaxios
    .get(`/admin/taluks/district/${districtId}`)
    .then(res => setTaluks(res.data))
    .catch(err => console.error(err));

}, [districtId]);

  /* =========================
     LOAD DOCTORS
  ========================= */
  useEffect(() => {
    if (!selectedDept) return;

    customaxios
      .get(`/token/doctors/${selectedDept}`)
      .then(res => setDoctors(res.data))
      .catch(err => console.error(err));

  }, [selectedDept]);

  /* =========================
     LOAD SLOTS
  ========================= */
  useEffect(() => {
    if (!selectedDoctor) return;

    customaxios
      .get(`/token/slots/${selectedDoctor.id}`)
      .then(res => setAvailableSlots(res.data))
      .catch(err => console.error(err));

  }, [selectedDoctor]);

  const handleDoctorChange = (e) => {
    setSelectedDoctor(doctors.find(d => d.id === Number(e.target.value)));
  };

  /* =========================
     BOOK TOKEN
  ========================= */
  const bookToken = async () => {
    if (!selectedDoctor || !selectedSlot || !reason) {
      toast.error("Please select all fields!");
      return;
    }

    try {
      const res = await customaxios.post("/token/book", {
        districtId: Number(districtId),   // ✅ PASS DISTRICT
        doctorId: selectedDoctor.id,
        patientId,
        tokenTime: selectedSlot,
        reason
      });

      toast.success("Token booked successfully!");

      navigate("/my-tokens", {
        state: { token: res.data, doctor: selectedDoctor }
      });

    } catch (err) {
      console.error(err);
      toast.error("Failed to book token!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
      <ToastContainer />

      <h2 className="text-2xl font-bold mb-4 text-center">
        Book Doctor Token
      </h2>

      <p className="text-center text-sm text-gray-600 mb-6">
        District ID: <b>{districtId}</b>
      </p>

      <div className="space-y-4">
        {/* Taluk */}



        {/* Department */}
        <div>
          <label className="block text-sm font-medium mb-1">Department</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
          >
            <option value="">--Select--</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Doctor */}
        <div>
          <label className="block text-sm font-medium mb-1">Doctor</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={selectedDoctor?.id || ""}
            onChange={handleDoctorChange}
          >
            <option value="">--Select--</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.hospitalName})
              </option>
            ))}
          </select>
        </div>

        {/* Slot */}
        <div>
          <label className="block text-sm font-medium mb-1">Slot</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={selectedSlot}
            onChange={e => setSelectedSlot(e.target.value)}
          >
            <option value="">--Select--</option>
            {availableSlots.map(slot => (
              <option key={slot} value={slot}>
                {new Date(slot).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true
                })}
              </option>
            ))}
          </select>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium mb-1">Reason</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
        </div>

        <button
          onClick={bookToken}
          className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
        >
          Book Token
        </button>
      </div>
    </div>
  );
};

export default TokenBooking;
