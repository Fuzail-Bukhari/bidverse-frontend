import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, Loader, ChevronDown, ChevronUp } from "lucide-react";
import api from "../../utils/axios";
import { formatCurrency } from "../../utils/helpers";
import toast from "react-hot-toast";

const AiBidSuggester = ({ auction }) => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(auction.endTime);
    const diff = end - now;
    if (diff <= 0) return "Ended";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleGetSuggestion = async () => {
    setLoading(true);
    try {
      const res = await api.post("/ai/suggest-bid", {
        currentPrice: auction.currentPrice,
        totalBids: auction.totalBids,
        timeRemaining: getTimeRemaining(),
        category: auction.category,
        startingPrice: auction.startingPrice,
      });
      setSuggestion(res.data.suggestion);
      setIsOpen(true);
    } catch (err) {
      toast.error("Failed to get AI suggestion");
    } finally {
      setLoading(false);
    }
  };

  const confidenceColor = {
    High: "text-green-400",
    Medium: "text-yellow-400",
    Low: "text-red-400",
  };

  const trendColor = {
    Rising: "text-red-400",
    Stable: "text-yellow-400",
    Slowing: "text-green-400",
  };

  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={suggestion ? () => setIsOpen(!isOpen) : handleGetSuggestion}
        disabled={loading}
        className="w-full flex items-center justify-between gap-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 px-4 py-3 rounded-xl transition-all text-sm"
      >
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-purple-400" />
          <span className="text-purple-300 font-medium">
            {loading ? "Analyzing auction..." : "Get AI Bid Suggestion"}
          </span>
        </div>
        {loading ? (
          <Loader size={16} className="text-purple-400 animate-spin" />
        ) : suggestion ? (
          isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />
        ) : (
          <TrendingUp size={16} className="text-purple-400" />
        )}
      </motion.button>

      <AnimatePresence>
        {suggestion && isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-3">
              {/* Suggested Bid */}
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-xs mb-1">AI Recommended Bid</p>
                <p className="text-3xl font-bold text-purple-400 font-heading">
                  {formatCurrency(suggestion.suggestedBid)}
                </p>
                <p className={`text-xs mt-1 font-medium ${confidenceColor[suggestion.confidence]}`}>
                  {suggestion.confidence} Confidence
                </p>
              </div>

              {/* Range */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-gray-500 text-xs">Min Bid</p>
                  <p className="text-white font-semibold text-sm">
                    {formatCurrency(suggestion.minBid)}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-gray-500 text-xs">Max Recommended</p>
                  <p className="text-white font-semibold text-sm">
                    {formatCurrency(suggestion.maxRecommended)}
                  </p>
                </div>
              </div>

              {/* Reasoning */}
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-gray-400 text-xs leading-relaxed">
                  💡 {suggestion.reasoning}
                </p>
              </div>

              {/* Strategy */}
              <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-3">
                <p className="text-gold-300 text-xs leading-relaxed">
                  🎯 {suggestion.strategy}
                </p>
              </div>

              {/* Refresh */}
              <button
                type="button"
                onClick={handleGetSuggestion}
                className="w-full text-xs text-gray-500 hover:text-gray-300 transition-colors py-1"
              >
                Refresh suggestion
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AiBidSuggester;