import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Shield, TrendingUp } from "lucide-react";
import BidInput from "./BidInput";
import PriceDisplay from "../ui/PriceDisplay";
import CountdownTimer from "../ui/CountdownTimer";
import useAuthStore from "../../store/authStore";
import { calculateMinBid, formatCurrency } from "../../utils/helpers";
import AiBidSuggester from "../ai/AiBidSuggester";

const BidPanel = ({ auction, onBidPlaced }) => {
  const { isAuthenticated, user } = useAuthStore();
  const [currentPrice, setCurrentPrice] = useState(auction?.currentPrice);

  useEffect(() => {
    setCurrentPrice(auction?.currentPrice);
  }, [auction?.currentPrice]);

  // Handle case when auction is undefined/null
  if (!auction) {
    return (
      <div className="glass rounded-2xl p-6 border border-white/10 sticky top-24">
        <p className="text-gray-400 text-center">Loading auction details...</p>
      </div>
    );
  }

  const isOwner = user?._id === auction?.sellerId?._id;
  const isLive = auction?.status === "live";
  const minBid = calculateMinBid(currentPrice);

  return (
    <div className="glass rounded-2xl p-6 border border-white/10 sticky top-24">
      {/* Price */}
      <PriceDisplay price={currentPrice} size="lg" />

      <div className="flex items-center gap-4 mt-2 mb-6">
        <span className="text-gray-400 text-sm">
          {auction?.totalBids} bids
        </span>
        <span className="text-gray-600">•</span>
        <span className="text-gray-400 text-sm">
          Min bid: <span className="text-gold-400">{formatCurrency(minBid)}</span>
        </span>
      </div>

      {/* Countdown */}
      {isLive && (
        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-2">Time Remaining</p>
          <CountdownTimer endTime={auction?.endTime} />
        </div>
      )}

      {/* Bid Input */}
      {isLive && !isOwner && isAuthenticated && (
        <BidInput
          auctionId={auction?._id}
          minBid={minBid}
          onSuccess={(data) => {
            setCurrentPrice(data.currentPrice);
            if (onBidPlaced) onBidPlaced(data);
          }}
        />
      )}

      {/* Not authenticated */}
      {!isAuthenticated && isLive && (
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm mb-3">
            Login to place a bid
          </p>
          <a
            href="/login"
            className="bg-gold-500 text-black font-semibold px-6 py-2.5 rounded-xl text-sm inline-block hover:bg-gold-600 transition-colors"
          >
            Login to Bid
          </a>
        </div>
      )}

      {/* Owner */}
      {isOwner && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
          <p className="text-blue-400 text-sm">This is your auction</p>
        </div>
      )}

      {/* Ended */}
      {auction?.status === "ended" && (
        <div className="bg-gray-500/10 border border-gray-500/20 rounded-xl p-3 text-center">
          <p className="text-gray-400 text-sm">This auction has ended</p>
        </div>
      )}

      {/* Trust badges */}
      <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-3 gap-3">
        {[
          { icon: Shield, label: "Secure" },
          { icon: Zap, label: "Instant" },
          { icon: TrendingUp, label: "Live" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <Icon size={16} className="text-gold-400" />
            <span className="text-gray-400 text-xs">{label}</span>
          </div>
        ))}
      </div>

      {/* ✅ ADD THIS - AI Bid Suggester (right before closing </div>) */}
      {isLive && !isOwner && isAuthenticated && (
        <AiBidSuggester auction={auction} />
      )}
    </div>
  );
};

export default BidPanel;