import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Sparkles, Loader } from "lucide-react";
import api from "../../utils/axios";
import { formatCurrency } from "../../utils/helpers";

const AiPricePredictor = ({ auction }) => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(auction?.endTime);
    const diff = end - now;
    if (diff <= 0) return "Ended";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const fetchPrediction = async () => {
    if (!auction || fetched) return;
    setLoading(true);
    try {
      const res = await api.post("/ai/predict-price", {
        title: auction.title,
        category: auction.category,
        currentPrice: auction.currentPrice,
        totalBids: auction.totalBids,
        timeRemaining: getTimeRemaining(),
        startingPrice: auction.startingPrice,
      });
      setPrediction(res.data.prediction);
      setFetched(true);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (auction?.status === "live") {
      const timer = setTimeout(fetchPrediction, 1000);
      return () => clearTimeout(timer);
    }
  }, [auction?._id]);

  if (auction?.status !== "live") return null;

  const trendColors = {
    Rising: "text-red-400 bg-red-500/10 border-red-500/20",
    Stable: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    Slowing: "text-green-400 bg-green-500/10 border-green-500/20",
  };

  const confidenceColors = {
    High: "text-green-400",
    Medium: "text-yellow-400",
    Low: "text-red-400",
  };

  return (
    <div className="glass rounded-2xl p-5 border border-purple-500/20 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} className="text-purple-400" />
        <h4 className="font-semibold text-sm font-heading">AI Price Prediction</h4>
        <span className="ml-auto text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
          Claude AI
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6 gap-2 text-gray-400 text-sm">
          <Loader size={16} className="animate-spin" />
          Analyzing auction data...
        </div>
      ) : prediction ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {/* Predicted Price */}
            <div className="text-center py-3">
              <p className="text-gray-400 text-xs mb-1">Predicted Final Price</p>
              <p className="text-3xl font-bold text-purple-400 font-heading">
                {formatCurrency(prediction.predictedPrice)}
              </p>
              <p className={`text-xs mt-1 ${confidenceColors[prediction.confidence]}`}>
                {prediction.confidence} Confidence
              </p>
            </div>

            {/* Range Bar */}
            <div className="bg-white/5 rounded-xl p-3">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Low: {formatCurrency(prediction.rangeLow)}</span>
                <span>High: {formatCurrency(prediction.rangeHigh)}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-purple-500 to-gold-500 rounded-full"
                />
              </div>
            </div>

            {/* Trend */}
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${trendColors[prediction.trend]}`}>
                <TrendingUp size={12} className="inline mr-1" />
                {prediction.trend}
              </span>
              <p className="text-gray-400 text-xs flex-1">{prediction.insight}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <button
          onClick={fetchPrediction}
          className="w-full text-sm text-purple-400 hover:text-purple-300 transition-colors py-2"
        >
          Click to predict final price
        </button>
      )}
    </div>
  );
};

export default AiPricePredictor;