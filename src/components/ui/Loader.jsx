import { motion } from "framer-motion";

const Loader = ({ fullScreen = false, size = "md" }) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const loader = (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className={`${sizes[size]} border-2 border-gold-500/30 border-t-gold-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark flex items-center justify-center z-50">
        {loader}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20">
      {loader}
    </div>
  );
};

export default Loader;