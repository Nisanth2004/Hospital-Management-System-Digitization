import React from "react";
import { ShieldCheck, HeartPulse, Hospital, FileText } from "lucide-react";

const schemes = [
  {
    name: "Kalaignar Kapitu Thittam",
    desc: "Free cashless treatment up to ₹5 lakh per family per year in empanelled hospitals.",
    icon: <HeartPulse />,
    eligibility: "Annual income below ₹72,000",
  },
  {
    name: "Chief Minister’s Comprehensive Health Insurance Scheme",
    desc: "Covers major surgeries and treatments for economically weaker sections.",
    icon: <ShieldCheck />,
    eligibility: "Tamil Nadu resident with ration card",
  },
  {
    name: "Innuyir Kappom – Nammai Kaakkum Thittam",
    desc: "Emergency accident treatment free of cost for first 48 hours.",
    icon: <Hospital />,
    eligibility: "All road accident victims",
  },
  {
    name: "Free Dialysis Scheme",
    desc: "Free dialysis services in government hospitals.",
    icon: <FileText />,
    eligibility: "Patients with kidney failure",
  },
];

const GovtMedicalSchemes = () => {
  return (
    <section className="bg-[#f5f7fa] py-20 px-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Tamil Nadu Government Medical Schemes
        </h2>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
          Official information on healthcare schemes provided by the
          Government of Tamil Nadu. This is a free public information service.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {schemes.map((scheme, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm
                       hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 text-green-700 rounded-lg">
                {scheme.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {scheme.name}
                </h3>
                <p className="mt-2 text-gray-600 text-sm">
                  {scheme.desc}
                </p>
                <p className="mt-3 text-sm font-medium text-gray-700">
                  Eligibility:
                  <span className="ml-1 text-gray-600">
                    {scheme.eligibility}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Govt Footer Note */}
      <p className="text-center text-xs text-gray-500 mt-10">
        Source: Government of Tamil Nadu | Information purpose only
      </p>
    </section>
  );
};

export default GovtMedicalSchemes;
