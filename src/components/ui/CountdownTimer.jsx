import useCountdown from "../../hooks/useCountdown";
import { motion } from "framer-motion";

const TimeBlock = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <motion.div
      key={value}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/10 rounded-lg w-12 h-12 flex items-center justify-center text-lg font-bold text-gold-400 font-heading"
    >
      {String(value).padStart(2, "0")}
    </motion.div>
    <span className="text-gray-500 text-xs mt-1">{label}</span>
  </div>
);

const CountdownTimer = ({ endTime, size = "md" }) => {
  const { days, hours, minutes, seconds, ended } = useCountdown(endTime);

  if (ended) {
    return (
      <span className="text-red-400 font-semibold">Auction Ended</span>
    );
  }

  if (size === "sm") {
    return (
      <span className="text-gold-400 font-mono text-sm">
        {days > 0 ? `${days}d ` : ""}{String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {days > 0 && <TimeBlock value={days} label="Days" />}
      <TimeBlock value={hours} label="Hrs" />
      <span className="text-gold-400 font-bold mb-4">:</span>
      <TimeBlock value={minutes} label="Min" />
      <span className="text-gold-400 font-bold mb-4">:</span>
      <TimeBlock value={seconds} label="Sec" />
    </div>
  );
};

export default CountdownTimer;