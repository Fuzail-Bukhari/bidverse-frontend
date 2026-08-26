import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Gavel } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block mb-6"
        >
          <Gavel className="text-gold-400 w-20 h-20 mx-auto" />
        </motion.div>
        <h1 className="text-8xl font-bold gold-text font-heading mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          Looks like this auction has already ended!
        </p>
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold px-8 py-3 rounded-2xl mx-auto transition-all gold-glow"
          >
            <Home size={18} />
            Back to Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;