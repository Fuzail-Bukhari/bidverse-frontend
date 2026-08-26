import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Heart, Pencil, Trash2, AlertTriangle } from "lucide-react";
import BidPanel from "../components/bid/BidPanel";
import BidHistory from "../components/auction/BidHistory";
import Badge from "../components/ui/Badge";
import Loader from "../components/ui/Loader";
import useAuctionStore from "../store/auctionStore";
import useAuthStore from "../store/authStore";
import { useSocketContext } from "../context/SocketContext";
import { formatDate, getImageUrl } from "../utils/helpers";
import { SOCKET_EVENTS } from "../utils/constants";
import api from "../utils/axios";
import toast from "react-hot-toast";
import AiPricePredictor from "../components/ai/AiPricePredictor";

const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentAuction, fetchAuction, loading, updateCurrentPrice } = useAuctionStore();
  const { isAuthenticated, user } = useAuthStore();
  const socket = useSocketContext();
  const [newBid, setNewBid] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchAuction(id);
  }, [id]);

  useEffect(() => {
    if (socket && id) {
      socket.emit(SOCKET_EVENTS.JOIN_AUCTION, id);
      socket.on(SOCKET_EVENTS.NEW_BID, (data) => {
        if (data.auctionId === id) {
          updateCurrentPrice(id, data.currentPrice, data.totalBids);
          setNewBid(data);
        }
      });
      return () => {
        socket.emit(SOCKET_EVENTS.LEAVE_AUCTION, id);
        socket.off(SOCKET_EVENTS.NEW_BID);
      };
    }
  }, [socket, id]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/auctions/${id}`);
      toast.success("Auction deleted");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (loading || !currentAuction) return <Loader fullScreen />;

  const auction = currentAuction;
  const isOwner = user?._id === auction.sellerId?._id ||
    user?._id === auction.sellerId;
  const canEdit = isOwner && (auction.status === "live" || auction.status === "scheduled");
  const canDelete = isOwner;

  const images = auction.images?.length > 0
    ? auction.images
    : ["https://placehold.co/800x600/1a1a2e/f59e0b?text=No+Image"];

  const statusVariant = {
    live: "live", scheduled: "scheduled",
    ended: "ended", cancelled: "default",
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative glass rounded-2xl p-6 w-full max-w-md border border-red-500/20 z-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="text-red-400 w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold font-heading">Delete Auction</h3>
                <p className="text-gray-400 text-sm">This cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              Delete <span className="text-white font-medium">"{auction.title}"</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : "Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </motion.button>

          {/* Owner Actions */}
          {isOwner && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              {canEdit && (
                <Link to={`/auctions/${id}/edit`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  >
                    <Pencil size={15} />
                    Edit Auction
                  </motion.button>
                </Link>
              )}
              {canDelete && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                >
                  <Trash2 size={15} />
                  Delete
                </motion.button>
              )}
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl overflow-hidden border border-white/10"
            >
              <div className="relative h-80 md:h-[450px]">
                <img
                  src={images[selectedImage]}
                  alt={auction.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />

                <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                  <Badge variant={statusVariant[auction.status]}>
                    {auction.status}
                  </Badge>
                  <Badge variant="gold">{auction.category}</Badge>
                </div>

                <div className="absolute top-4 right-4 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setLiked(!liked)}
                    className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                  >
                    <Heart
                      size={18}
                      className={liked ? "text-red-400 fill-red-400" : "text-gray-300"}
                    />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShare}
                    className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                  >
                    <Share2 size={18} className="text-gray-300" />
                  </motion.button>
                </div>
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImage === i ? "border-gold-500" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 border border-white/10"
            >
              <h1 className="text-3xl font-bold font-heading mb-3">{auction.title}</h1>
              <p className="text-gray-400 leading-relaxed mb-6">{auction.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: "Start Time", value: formatDate(auction.startTime) },
                  { label: "End Time", value: formatDate(auction.endTime) },
                  { label: "Starting Price", value: `$${auction.startingPrice}` },
                  { label: "Total Bids", value: auction.totalBids },
                  { label: "Seller", value: auction.sellerId?.name || "Unknown" },
                  { label: "Category", value: auction.category },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/5 rounded-xl p-3">
                    <p className="text-gray-500 text-xs mb-1">{label}</p>
                    <p className="text-white font-medium text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Bid History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <BidHistory auctionId={id} newBid={newBid} />
            </motion.div>
          </div>

          {/* Right — Bid Panel */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <BidPanel
                auction={auction}
                onBidPlaced={(data) => {
                  updateCurrentPrice(id, data.currentPrice, auction.totalBids + 1);
                  setNewBid(data.bid);
                }}
              />
            </motion.div>

            {/* ✅ ADD THIS - AI Price Predictor (right after BidPanel) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-4"
            >
              <AiPricePredictor auction={auction} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;