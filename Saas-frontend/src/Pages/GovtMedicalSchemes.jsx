import SchemeCard from "../components/SchemeCard";
import { schemes } from "../data/schemes";

const GovtMedicalSchemes = () => {
  return (
    <section className="bg-slate-50 py-20 px-6">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900">
          Tamil Nadu Government Medical Schemes
        </h1>
        <p className="mt-4 text-slate-600 max-w-3xl mx-auto">
          Official healthcare initiatives by the Government of Tamil Nadu.
          This portal provides free public information for citizen awareness.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {schemes.map((scheme) => (
          <SchemeCard key={scheme.id} scheme={scheme} />
        ))}
      </div>

      <p className="text-center text-xs text-slate-500 mt-16">
        Source: Government of Tamil Nadu | For informational purposes only
      </p>
    </section>
  );
};

export default GovtMedicalSchemes;
