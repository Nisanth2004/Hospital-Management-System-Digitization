import React, { useState } from "react";
import customaxios from "../../service/customAxios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const RaiseComplaint = () => {

  const { districtId, talukId } = useParams();
const [cameraOn, setCameraOn] = useState(false);
const [previewImage, setPreviewImage] = useState(null);
const videoRef = React.useRef(null);
  const [citizenName, setCitizenName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const submitComplaint = async () => {

    if (!citizenName || !mobileNumber || !category || !description) {
      alert("Please fill all mandatory fields");
      return;
    }

    const formData = new FormData();
    formData.append("districtId", districtId);
    formData.append("talukId", talukId);
    formData.append("citizenName", citizenName);
    formData.append("mobileNumber", mobileNumber);
    formData.append("hospitalName", hospitalName);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("image", image);

    try {
      setLoading(true);
      await customaxios.post(
        "/public/complaints/submit",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Your grievance has been successfully submitted. We regret the inconvenience caused.");
    } catch (err) {
      alert("Error submitting complaint");
    } finally {
      setLoading(false);
    }
  };

const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment"
      },
      audio: false
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    setCameraOn(true);

  } catch (err) {
    console.error(err);
    alert("Camera access denied or not available.");
  }
};

const capturePhoto = () => {
  const canvas = document.createElement("canvas");
  canvas.width = videoRef.current.videoWidth;
  canvas.height = videoRef.current.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoRef.current, 0, 0);

  canvas.toBlob((blob) => {
    const file = new File([blob], "camera-image.png", { type: "image/png" });
    setImage(file);
    setPreviewImage(URL.createObjectURL(blob));
  });

  stopCamera();
};
const stopCamera = () => {
  const stream = videoRef.current.srcObject;
  const tracks = stream.getTracks();
  tracks.forEach(track => track.stop());
  setCameraOn(false);
};


  return (
    <div className="min-h-screen bg-gray-100 py-10">

      {/* Government Header */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">
            Government Public Healthcare Grievance Portal
          </h1>
          <p className="text-gray-600 mt-2">
            Department of Public Health & Family Welfare
          </p>
        </div>

        {/* Government Notice */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="text-sm text-gray-700">
            We sincerely regret any inconvenience caused. The Government is committed 
            to providing transparent, accountable, and quality healthcare services. 
            Your complaint will be reviewed and addressed within the stipulated time frame.
          </p>
        </div>
        <div className="flex justify-end mb-4">
  <button
    onClick={() => navigate(`/user/complaints/${talukId}`)}
    className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
  >
    View All Complaints
  </button>
</div>


        {/* Complaint Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Citizen Name *"
            className="border p-3 rounded"
            onChange={e => setCitizenName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Mobile Number *"
            className="border p-3 rounded"
            onChange={e => setMobileNumber(e.target.value)}
          />

          <input
            type="text"
            placeholder="Hospital Name (Optional)"
            className="border p-3 rounded"
            onChange={e => setHospitalName(e.target.value)}
          />

          <select
            className="border p-3 rounded"
            onChange={e => setCategory(e.target.value)}
          >
            <option value="">Select Complaint Category *</option>
            <option>Infrastructure Issue</option>
            <option>Doctor Unavailability</option>
            <option>Medicine Shortage</option>
            <option>Hygiene Issue</option>
            <option>Staff Behaviour</option>
            <option>Other</option>
          </select>

        </div>

        <textarea
          className="w-full border p-3 rounded mt-4"
          rows="4"
          placeholder="Detailed Description of the Complaint *"
          onChange={e => setDescription(e.target.value)}
        />

        {/* File Upload with Camera */}
       <div className="mt-4">

  <button
    type="button"
    onClick={startCamera}
    className="bg-green-600 text-white px-4 py-2 rounded mr-3"
  >
    Open Camera
  </button>

  <input
    type="file"
    accept="image/*"
    className="border p-2 rounded"
    onChange={e => {
      setImage(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }}
  />

  {cameraOn && (
    <div className="mt-4">
 

      <button
        onClick={capturePhoto}
        className="bg-blue-700 text-white px-4 py-2 mt-2 rounded"
      >
        Capture Photo
      </button>
    </div>
  )}

  {previewImage && (
    <img
      src={previewImage}
      alt="Preview"
      className="mt-4 w-full rounded h-95 w-45"
    />
  )}

</div>


        <button
          onClick={submitComplaint}
          disabled={loading}
          className="w-full mt-6 bg-blue-800 hover:bg-blue-900 text-white py-3 rounded-lg"
        >
          {loading ? "Submitting..." : "Submit Grievance"}
        </button>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          © 2026 Government Healthcare Monitoring System | All Rights Reserved
        </div>

      </div>
    </div>
  );
};

export default RaiseComplaint;
