import { assets } from "../assets/assets";
import { SignedOut } from "@clerk/clerk-react";

const PublicHome = () => {
  return (
    <div className="bg-[#F4F9F4]">

      {/* HERO SECTION */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-14 items-center">

          {/* LEFT CONTENT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1F2937] leading-tight">
              Government of Tamil Nadu
              <span className="block text-[#1B5E20] mt-2">
                Digital Hospital Monitoring Platform
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-700 leading-relaxed">
              An official digital initiative by the Government of Tamil Nadu
              to monitor hospital infrastructure, bed availability, and
              medical stock status across all districts in real-time.
            </p>

            <p className="mt-4 text-gray-700 leading-relaxed">
              This platform enhances transparency, emergency preparedness,
              and data-driven healthcare administration for the benefit of citizens.
            </p>

            {/* USER GUIDANCE MESSAGE */}
            <SignedOut>
              <div className="mt-8 bg-[#E8F5E9] border-l-4 border-[#1B5E20] p-5 rounded-md">
                <p className="text-[#1B5E20] font-semibold text-lg">
                  Access Restricted
                </p>
                <p className="text-gray-700 mt-2">
                  Please log in or register using your authorized credentials
                  to access district dashboards, hospital data,
                  and digital healthcare services.
                </p>
              </div>
            </SignedOut>
          </div>

          {/* RIGHT VIDEO */}
          <div className="rounded-2xl overflow-hidden shadow-lg border">
            <video
              src={assets.video_banner}
              autoPlay
              muted
              loop
              className="w-full h-[360px] object-cover"
            />
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-[#1B5E20] mb-12">
          Platform Capabilities
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Real-Time Bed Monitoring",
              desc: "Live tracking of ICU, General, and Emergency beds across government hospitals."
            },
            {
              title: "Medical Stock Oversight",
              desc: "Continuous visibility of essential medicines and critical supplies."
            },
            {
              title: "Emergency Response Support",
              desc: "Data-driven insights for district authorities during health emergencies."
            },
            {
  title: "Hospital-wise Performance Insights",
  desc: "Structured dashboards to assess hospital occupancy trends, resource utilization, and service readiness."
},
{
  title: "District-Level Health Administration",
  desc: "Centralized monitoring tools for district officials to oversee healthcare facilities under their jurisdiction."
},
{
  title: "Secure & Authorized Access",
  desc: "Role-based access control ensuring data security for government officials, hospitals, and administrators."
}

          ].map((f, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-xl shadow border-t-4 border-[#2E7D32]"
            >
              <h3 className="text-xl font-semibold text-[#1F2937] mb-3">
                {f.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* GOVERNMENT MESSAGE */}
      <section className="bg-[#1B5E20] text-white py-16">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-6">
            Government Commitment to Public Healthcare
          </h2>
          <p className="text-lg leading-relaxed opacity-95">
            The Government of Tamil Nadu is committed to strengthening public healthcare
            through secure digital systems that improve accountability,
            efficiency, and citizen trust.
          </p>
        </div>
      </section>

    </div>
  );
};

export default PublicHome;
