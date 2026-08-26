import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Crown } from "lucide-react";
import api from "../../utils/axios";
import { formatCurrency } from "../../utils/helpers";

const BidHistory = ({ auctionId, newBid }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBids();
  }, [auctionId]);

  useEffect(() => {
    if (newBid) {
      setBids((prev) => [newBid, ...prev]);
    }
  }, [newBid]);

  const fetchBids = async () => {
    try {
      const res = await api.get(`/bids/auction/${auctionId}`);
      setBids(res.data.bids);
    } catch {}
    setLoading(false);
  };

  return (
    <div className="glass rounded-2xl p-5 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={18} className="text-gold-400" />
        <h3 className="font-semibold font-heading">Bid History</h3>
        <span className="ml-auto text-gray-400 text-sm">{bids.length} bids</span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        <AnimatePresence>
          {bids.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">
              No bids yet. Be the first!
            </p>
          ) : (
            bids.map((bid, index) => (
              <motion.div
                key={bid._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  index === 0
                    ? "bg-gold-500/10 border border-gold-500/20"
                    : "bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  {index === 0 && (
                    <Crown size={14} className="text-gold-400" />
                  )}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0
                        ? "bg-gold-500/20 text-gold-400"
                        : "bg-white/10 text-gray-300"
                    }`}
                  >
                    {bid.bidderId?.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {bid.bidderId?.name || "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(bid.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`font-bold font-heading ${
                    index === 0 ? "text-gold-400" : "text-white"
                  }`}
                >
                  {formatCurrency(bid.amount)}
                </span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BidHistory;