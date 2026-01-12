import { useParams, Link } from "react-router-dom";
import { schemes } from "../data/schemes";
import { motion } from "framer-motion";

const SchemeDetails = () => {
  const { id } = useParams();
  const scheme = schemes.find((s) => s.id === id);

  if (!scheme) {
    return <div className="p-10 text-center">Scheme not found</div>;
  }

  return (
    <section className="bg-white min-h-screen">
      {/* Header */}
      <div className={`${scheme.color} text-white py-16`}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold"
          >
            {scheme.name}
          </motion.h1>
          <p className="mt-4 text-lg opacity-90">{scheme.tagline}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">

        {/* About */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">About the Scheme</h2>
          <p className="text-slate-700">{scheme.description}</p>
        </section>

        {/* Eligibility */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Eligibility</h2>
          <p className="text-slate-700">{scheme.eligibility}</p>
        </section>

        {/* Benefits */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Key Benefits</h2>
          <ul className="list-disc list-inside text-slate-700 space-y-2">
            {scheme.benefits.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </section>

        {/* Coverage */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Coverage Network</h2>
          <p className="text-slate-700">{scheme.coverage}</p>
        </section>

        {/* Exclusions */}
        {scheme.exclusions && (
          <section>
            <h2 className="text-2xl font-semibold mb-3">Exclusions</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              {scheme.exclusions.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Application Process */}
        {scheme.applicationProcess && (
          <section>
            <h2 className="text-2xl font-semibold mb-3">
              Application Process ({scheme.applicationProcess.mode})
            </h2>
            <ol className="list-decimal list-inside text-slate-700 space-y-2">
              {scheme.applicationProcess.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>
        )}

        {/* Documents */}
        {scheme.documentsRequired && (
          <section>
            <h2 className="text-2xl font-semibold mb-3">
              Documents Required
            </h2>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              {scheme.documentsRequired.map((doc, i) => (
                <li key={i}>{doc}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Extra Info */}
        {(scheme.implementedBy || scheme.beneficiaries) && (
          <section className="bg-slate-50 p-4 rounded-lg">
            {scheme.implementedBy && (
              <p><strong>Implemented By:</strong> {scheme.implementedBy}</p>
            )}
            {scheme.beneficiaries && (
              <p><strong>Beneficiaries:</strong> {scheme.beneficiaries}</p>
            )}
          </section>
        )}

        {/* Back */}
        <div className="pt-8 border-t">
          <Link to="/" className="text-sm font-medium text-teal-700 hover:underline">
            ← Back to Schemes
          </Link>
        </div>

      </div>
    </section>
  );
};

export default SchemeDetails;
