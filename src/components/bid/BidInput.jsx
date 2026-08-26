import { useState } from "react";
import { motion } from "framer-motion";
import { Gavel } from "lucide-react";
import Button from "../ui/Button";
import useBid from "../../hooks/useBid";
import { formatCurrency } from "../../utils/helpers";

const BidInput = ({ auctionId, minBid, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const { placeBid, loading } = useBid(auctionId, onSuccess);

  const handleBid = async () => {
    const bidAmount = Number(amount);
    if (bidAmount < minBid) {
      return;
    }
    await placeBid(bidAmount);
    setAmount("");
  };

  const quickBids = [minBid, minBid + 50, minBid + 100];

  return (
    <div className="space-y-3">
      {/* Quick bid buttons */}
      <div className="grid grid-cols-3 gap-2">
        {quickBids.map((bid) => (
          <motion.button
            key={bid}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAmount(String(bid))}
            className={`py-2 rounded-xl text-sm font-medium border transition-all ${
              Number(amount) === bid
                ? "bg-gold-500/20 border-gold-500 text-gold-400"
                : "bg-white/5 border-white/10 text-gray-300 hover:border-gold-500/30"
            }`}
          >
            {formatCurrency(bid)}
          </motion.button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-400 font-bold">
          $
        </span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`Min ${formatCurrency(minBid)}`}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white placeholder-gray-500 outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all"
        />
      </div>

      <Button
        onClick={handleBid}
        loading={loading}
        disabled={!amount || Number(amount) < minBid}
        size="lg"
        className="w-full"
      >
        <Gavel size={18} />
        Place Bid
      </Button>

      <p className="text-gray-500 text-xs text-center">
        Minimum bid: {formatCurrency(minBid)}
      </p>
    </div>
  );
};

export default BidInput;