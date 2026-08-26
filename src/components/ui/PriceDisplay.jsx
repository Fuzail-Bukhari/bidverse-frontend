import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "../../utils/helpers";

const PriceDisplay = ({ price, label = "Current Bid", size = "md" }) => {
  const sizes = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl",
  };

  return (
    <div className="flex flex-col">
      <span className="text-gray-400 text-sm">{label}</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={price}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className={`font-bold gold-text font-heading ${sizes[size]}`}
        >
          {formatCurrency(price)}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default PriceDisplay;