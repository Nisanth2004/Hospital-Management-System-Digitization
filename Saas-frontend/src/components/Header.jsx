import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Header = () => {
     const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center mb-20">

      {/* ===== Left: Govt Visual / Video / Image ===== */}
      <div className="order-2 md:order-1 flex justify-center">
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
          <img
            src={assets.b3}
            alt="Government Hospital Digitalization"
            className="w-full max-w-[420px] h-150 object-cover"
          />
        </div>
      </div>

      {/* ===== Right: Govt Text Content ===== */}
      <div className="order-1 md:order-2">

        {/* Govt Badge */}
        <div className="inline-block mb-4 px-4 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
          Tamil Nadu Government • Health Department
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
          Digital Transformation of <br />
          <span className="text-green-700">
            Government Hospital Services
          </span>
        </h1>

        <p className="text-slate-600 mb-8 text-lg leading-relaxed max-w-xl">
          A centralized digital platform to manage district-wise hospital
          operations, medical stock inventory, and healthcare resources
          efficiently across Tamil Nadu Government Hospitals.
        </p>

        {/* ===== Key Highlights ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="flex items-start gap-3">
            <span className="text-green-600 text-xl">✔</span>
            <p className="text-slate-700">
              District-wise medical stock monitoring
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-600 text-xl">✔</span>
            <p className="text-slate-700">
              Real-time medicine availability
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-600 text-xl">✔</span>
            <p className="text-slate-700">
              Expiry & low-stock alerts
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-600 text-xl">✔</span>
            <p className="text-slate-700">
              Secure admin-controlled access
            </p>
          </div>
        </div>

        {/* ===== CTA Buttons ===== */}
        <div className="flex flex-wrap gap-4">
          <button
      onClick={() => navigate("/districts")}
      className="bg-green-700 text-white px-8 py-4 rounded-full hover:bg-green-800 transition"
    >
      Go to District Dashboard
    </button>

         
        </div>
      </div>
    </div>
  );
};

export default Header;
