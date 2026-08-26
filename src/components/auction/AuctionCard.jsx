import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Users, TrendingUp, Pencil, Trash2 } from "lucide-react";
import Badge from "../ui/Badge";
import CountdownTimer from "../ui/CountdownTimer";
import { formatCurrency, getImageUrl, truncateText } from "../../utils/helpers";
import useAuthStore from "../../store/authStore";

const AuctionCard = ({ auction, index = 0, onDelete, showActions = false }) => {
  const { user } = useAuthStore();
  const isOwner = user?._id === auction.sellerId?._id ||
    user?._id === auction.sellerId;

  const statusVariant = {
    live: "live", scheduled: "scheduled",
    ended: "ended", cancelled: "default",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -8 }}
      className="auction-card"
    >
      <Link to={`/auctions/${auction._id}`}>
        <div className="glass rounded-2xl overflow-hidden border border-white/10 hover:border-gold-500/30 transition-all duration-300 group">
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={getImageUrl(auction.images)}
              alt={auction.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />

            <div className="absolute top-3 left-3">
              <Badge variant={statusVariant[auction.status]}>
                {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
              </Badge>
            </div>

            <div className="absolute top-3 right-3">
              <Badge variant="gold">{auction.category}</Badge>
            </div>

            {auction.status === "live" && (
              <div className="absolute bottom-3 left-3">
                <CountdownTimer endTime={auction.endTime} size="sm" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-white font-heading mb-1 group-hover:text-gold-400 transition-colors">
              {truncateText(auction.title, 40)}
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              {truncateText(auction.description, 60)}
            </p>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs">Current Bid</p>
                <p className="text-gold-400 font-bold text-lg font-heading">
                  {formatCurrency(auction.currentPrice)}
                </p>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-xs">
                <div className="flex items-center gap-1">
                  <Users size={12} />
                  <span>{auction.totalBids}</span>
                </div>
                {auction.status === "live" && (
                  <div className="flex items-center gap-1 text-green-400">
                    <TrendingUp size={12} />
                    <span>Live</span>
                  </div>
                )}
              </div>
            </div>

            {auction.sellerId && (
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center">
                  <span className="text-gold-400 text-xs font-bold">
                    {auction.sellerId.name?.charAt(0) || "?"}
                  </span>
                </div>
                <span className="text-gray-400 text-xs">
                  {auction.sellerId.name || "Unknown"}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default AuctionCard;