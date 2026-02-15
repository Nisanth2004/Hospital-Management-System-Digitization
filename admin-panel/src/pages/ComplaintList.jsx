import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const ComplaintList = () => {
  const { talukId } = useParams();
  const [complaints, setComplaints] = useState([]);
  const [remarkText, setRemarkText] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchComplaints = () => {
    setLoading(true);
    api.get(`/complaints/taluk/${talukId}`)
      .then((res) => setComplaints(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComplaints();
  }, [talukId]);

  const updateStatus = (id, status) => {
    api.put(`/complaints/${id}/status?status=${status}`)
      .then(() => fetchComplaints());
  };

  const updatePriority = (id, priority) => {
    api.put(`/complaints/${id}/priority?priority=${priority}`)
      .then(() => fetchComplaints());
  };

  const addRemark = (id) => {
    if (!remarkText[id]) return;

    api.put(`/complaints/${id}/remark?remark=${remarkText[id]}`)
      .then(() => {
        fetchComplaints();
        setRemarkText({ ...remarkText, [id]: "" });
      });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-400";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-400";
      case "RESOLVED":
        return "bg-green-100 text-green-800 border-green-400";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-400";
      default:
        return "bg-gray-100 text-gray-700 border-gray-400";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-600 text-white";
      case "MEDIUM":
        return "bg-orange-500 text-white";
      case "LOW":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-10">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            Taluk Complaint Management
          </h2>

          <button
            onClick={fetchComplaints}
            className="bg-blue-700 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-800 transition"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {complaints.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow text-center">
            <p className="text-gray-500 text-lg">
              No complaints available for this Taluk.
            </p>
          </div>
        ) : (
          <div className="grid gap-8">

            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-white rounded-2xl shadow-lg p-8 border hover:shadow-xl transition"
              >

                {/* Top Section */}
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {complaint.category}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Complaint ID: #{complaint.id}
                    </p>
                  </div>

                  <div className="flex gap-3 flex-wrap">

                    <span className={`px-4 py-1 text-xs rounded-full border font-semibold ${getStatusStyle(complaint.status)}`}>
                      {complaint.status}
                    </span>

                    <span className={`px-4 py-1 text-xs rounded-full font-semibold ${getPriorityStyle(complaint.priority)}`}>
                      {complaint.priority} Priority
                    </span>

                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {complaint.description}
                  </p>
                </div>

                {/* Info Grid */}
                <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600 mb-6">
                  <div>
                    <strong>Citizen Name</strong>
                    <p>{complaint.citizenName}</p>
                  </div>
                  <div>
                    <strong>Mobile Number</strong>
                    <p>{complaint.mobileNumber}</p>
                  </div>
                  <div>
                    <strong>Hospital</strong>
                    <p>{complaint.hospitalName || "Not Provided"}</p>
                  </div>
                </div>

                {/* Admin Remark */}
                {complaint.adminRemark && (
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg mb-6">
                    <p className="text-sm text-blue-900">
                      <strong>Admin Remark:</strong><br />
                      {complaint.adminRemark}
                    </p>
                  </div>
                )}

                {/* Action Section */}
                <div className="grid md:grid-cols-3 gap-6">

                  {/* Status Buttons */}
                  <div>
                    <p className="text-sm font-semibold mb-2 text-gray-700">
                      Update Status
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => updateStatus(complaint.id, "IN_PROGRESS")}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => updateStatus(complaint.id, "RESOLVED")}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => updateStatus(complaint.id, "REJECTED")}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>

                  {/* Priority Buttons */}
                  <div>
                    <p className="text-sm font-semibold mb-2 text-gray-700">
                      Update Priority
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => updatePriority(complaint.id, "HIGH")}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        High
                      </button>
                      <button
                        onClick={() => updatePriority(complaint.id, "MEDIUM")}
                        className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
                      >
                        Medium
                      </button>
                      <button
                        onClick={() => updatePriority(complaint.id, "LOW")}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Low
                      </button>
                    </div>
                  </div>

                  {/* Remark */}
                  <div>
                    <p className="text-sm font-semibold mb-2 text-gray-700">
                      Add / Update Remark
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter remark..."
                        value={remarkText[complaint.id] || ""}
                        onChange={(e) =>
                          setRemarkText({
                            ...remarkText,
                            [complaint.id]: e.target.value
                          })
                        }
                        className="border px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
                      />
                      <button
                        onClick={() => addRemark(complaint.id)}
                        className="bg-gray-800 text-white px-4 rounded hover:bg-gray-900"
                      >
                        Save
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default ComplaintList;
