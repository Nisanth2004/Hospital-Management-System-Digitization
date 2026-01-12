import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const SchemeCard = ({ scheme }) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg"
    >
      <div className={`h-2 rounded-t-xl ${scheme.color}`} />

      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-900">
          {scheme.name}
        </h3>

        <p className="text-sm text-slate-600 mt-2">
          {scheme.tagline}
        </p>

        <p className="mt-4 text-slate-700 text-sm line-clamp-3">
          {scheme.description}
        </p>

        <Link
          to={`/schemes/${scheme.id}`}
          className="inline-block mt-6 text-sm font-medium text-teal-700 hover:underline"
        >
          View Full Details →
        </Link>
      </div>
    </motion.div>
  );
};

export default SchemeCard;
