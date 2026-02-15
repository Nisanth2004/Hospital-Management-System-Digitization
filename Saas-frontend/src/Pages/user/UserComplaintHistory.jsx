import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import customaxios from "../../service/customAxios";

const UserComplaintHistory = () => {
  const { talukId } = useParams();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComplaints();

    // 🔁 Auto refresh every 15 seconds
    const interval = setInterval(() => {
      fetchComplaints();
    }, 15000);

    return () => clearInterval(interval);
  }, [talukId]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await customaxios.get(
        `/admin/complaints/taluk/${talukId}`
      );
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-blue-900">
             Complaint Dashboard
          </h2>

          <button
            onClick={fetchComplaints}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800 transition"
          >
            {loading ? "Refreshing..." : "Refresh Now"}
          </button>
        </div>

        {/* Empty State */}
        {complaints.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow text-center">
            <h3 className="text-lg font-semibold text-gray-600">
              No Complaints Found
            </h3>
            <p className="text-gray-400 mt-2">
              Your submitted complaints will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">

            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-white rounded-2xl shadow-lg p-6 border hover:shadow-xl transition"
              >
                {/* Top Row */}
                <div className="flex flex-wrap justify-between items-center gap-3 mb-4">

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {complaint.category}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Complaint ID: #{complaint.id}
                    </p>
                  </div>

                  <div className="flex gap-3">

                    {/* Status Badge */}
                    <span
                      className={`px-4 py-1 text-xs rounded-full border font-semibold ${getStatusStyle(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>

                    {/* Priority Badge */}
                    <span
                      className={`px-4 py-1 text-xs rounded-full font-semibold ${getPriorityStyle(
                        complaint.priority
                      )}`}
                    >
                      {complaint.priority} Priority
                    </span>

                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {complaint.description}
                </p>

                {/* Info Section */}
                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <strong>Hospital:</strong><br />
                    {complaint.hospitalName || "Not Provided"}
                  </div>
                  <div>
                    <strong>Submitted On:</strong><br />
                    {complaint.createdAt
                      ? new Date(complaint.createdAt).toLocaleString()
                      : "N/A"}
                  </div>
                  <div>
                    <strong>Last Updated:</strong><br />
                    {complaint.resolvedAt
                      ? new Date(complaint.resolvedAt).toLocaleString()
                      : "Pending"}
                  </div>
                </div>

                {/* Image */}
                {complaint.imagePath && (
                  <img
                    src={`http://localhost:8081/uploads/${complaint.imagePath}`}
                    alt="Complaint"
                    className="mt-3 rounded-xl w-full max-h-72 object-cover shadow"
                  />
                )}

                {/* Admin Remark */}
                {complaint.adminRemark && (
                  <div className="mt-5 bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>Official Response:</strong><br />
                      {complaint.adminRemark}
                    </p>
                  </div>
                )}
              </div>
            ))}

          </div>
        )}

        {/* Auto Refresh Notice */}
        <p className="text-xs text-gray-400 text-center mt-8">
          This page automatically refreshes every 15 seconds to show status updates.
        </p>

      </div>
    </div>
  );
};

export default UserComplaintHistory;
