import React from "react";

const steps = [
  {
    step: "01",
    title: "Check Eligibility",
    desc: "Verify income, residency, or medical condition eligibility for the scheme.",
  },
  {
    step: "02",
    title: "Visit Government Hospital",
    desc: "Approach any government or empanelled private hospital.",
  },
  {
    step: "03",
    title: "Provide Documents",
    desc: "Ration card, Aadhaar, income certificate, or accident details.",
  },
  {
    step: "04",
    title: "Get Cashless Treatment",
    desc: "Treatment provided free of cost under the scheme.",
  },
];

const SchemeUsageGuide = () => {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
          How to Use Government Medical Schemes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-6 text-center
                         hover:bg-gray-50 transition"
            >
              <div className="text-3xl font-bold text-green-700 mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          This platform helps citizens understand schemes. Final approval lies
          with Government authorities.
        </p>
      </div>
    </section>
  );
};

export default SchemeUsageGuide;
