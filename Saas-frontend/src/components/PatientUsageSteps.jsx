import React from "react";

const patientSteps = [
  {
    step: "Step 1",
    title: "Access District Dashboard",
    description:
      "Citizens can begin by accessing the district dashboard to view healthcare facilities available in their district."
  },
  {
    step: "Step 2",
    title: "Select Your District",
    description:
      "Choose your district to view government hospitals and healthcare resources managed under that district."
  },
  {
    step: "Step 3",
    title: "Check Bed Availability",
    description:
      "View real-time availability of ICU, General, and Emergency beds across government hospitals."
  },
  {
    step: "Step 4",
    title: "View Medical Stock Status",
    description:
      "Check availability of essential medicines, critical drugs, and medical supplies before visiting a hospital."
  },
  {
    step: "Step 5",
    title: "Emergency Readiness Information",
    description:
      "Access verified hospital readiness data to make informed decisions during medical emergencies."
  },
  {
    step: "Step 6",
    title: "Transparent Government Healthcare",
    description:
      "Ensure transparency and trust through officially managed, real-time healthcare data."
  }
];

const PatientUsageSteps = () => {
  return (
    <div className="text-center mb-20">

      {/* SECTION TITLE */}
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
        How Patients Can Use This Platform
      </h2>

      <p className="text-slate-600 max-w-3xl mx-auto mb-12 text-lg">
        A simple, transparent, and government-authorized digital process
        designed to help citizens access healthcare information efficiently.
      </p>

      {/* STEPS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {patientSteps.map((item, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 text-left hover:shadow-lg transition"
          >
            <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
              {item.step}
            </span>

            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {item.title}
            </h3>

            <p className="text-slate-600 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default PatientUsageSteps;
