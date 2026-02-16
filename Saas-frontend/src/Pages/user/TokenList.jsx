import React, { useEffect, useState } from "react";
import customaxios from "../../service/customAxios";

const TokenList = ({ patientId }) => {
  const [tokens, setTokens] = useState([]);

  const fetchTokens = () => {
    customaxios
      .get(`/token/my-tokens/${patientId}`)
      .then(res => {
        const updatedTokens = res.data.map(token => {
          const tokenTime = new Date(token.tokenTime);
          const now = new Date();

          // ✅ Cancel if token time or day has passed
          if (token.status === "BOOKED" && tokenTime < now) {
            return { ...token, status: "CANCELLED" };
          }

          return token;
        });

        // Only keep today tokens if you want to show only current-day tokens
        const todayTokens = updatedTokens.filter(token => {
          const tokenTime = new Date(token.tokenTime);
          const today = new Date();
          return (
            tokenTime.getFullYear() === today.getFullYear() &&
            tokenTime.getMonth() === today.getMonth() &&
            tokenTime.getDate() === today.getDate()
          );
        });

        setTokens(todayTokens);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchTokens();

    // ✅ Check every 1 minute
    const interval = setInterval(() => {
      setTokens(prevTokens =>
        prevTokens.map(token => {
          const tokenTime = new Date(token.tokenTime);
          const now = new Date();

          if (token.status === "BOOKED" && tokenTime < now) {
            return { ...token, status: "CANCELLED" };
          }

          return token;
        })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, [patientId]);

  if (!tokens.length) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-xl text-center">
        <h2 className="text-xl font-bold">No tokens found</h2>
        <p className="text-gray-500 mt-2">
          You don't have any tokens for today.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-6">
      <h2 className="text-3xl font-bold text-center mb-6">Today's Tokens</h2>

      {tokens.map(token => (
        <div
          key={token.id}
          className={`bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row md:justify-between md:items-center border border-gray-200 hover:shadow-xl transition-shadow ${
            token.status === "CANCELLED" ? "opacity-60" : ""
          }`}
        >
          <div className="flex flex-col mb-4 md:mb-0">
            <span className="font-semibold text-lg">{token.doctorName}</span>
            <span className="text-gray-500">{token.department}</span>
            <span className="text-gray-400 text-sm">{token.hospitalName}</span>
          </div>

          <div className="flex flex-col mb-4 md:mb-0">
            <span className="font-medium text-gray-700">Token Time</span>
            <span className="text-gray-900 text-lg">
              {new Date(token.tokenTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
              })}
            </span>
          </div>

          <div className="flex flex-col mb-4 md:mb-0">
            <span className="font-medium text-gray-700">Reason</span>
            <span className="text-gray-900">{token.reason}</span>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <span className="font-medium text-gray-700">Status</span>
            <span
              className={`px-3 py-1 rounded-full text-white text-sm mt-1 ${
                token.status === "BOOKED"
                  ? "bg-green-500"
                  : token.status === "COMPLETED"
                  ? "bg-blue-500"
                  : "bg-red-500"
              }`}
            >
              {token.status}
            </span>
          </div>

          {token.status === "COMPLETED" && (
  <a
    href={`http://localhost:8081/api/token/download-report/${token.id}`}
    className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm"
  >
    Download Report
  </a>
)}

        </div>
      ))}
    </div>
  );
};

export default TokenList;
