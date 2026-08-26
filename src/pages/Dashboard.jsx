import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gavel, TrendingUp, Clock, CheckCircle,
  Plus, DollarSign, Pencil, Trash2,
  AlertTriangle, Eye,
} from "lucide-react";
import Loader from "../components/ui/Loader";
import Badge from "../components/ui/Badge";
import useAuthStore from "../store/authStore";
import useAuctionStore from "../store/auctionStore";
import { formatCurrency, formatDate, getImageUrl } from "../utils/helpers";
import api from "../utils/axios";
import toast from "react-hot-toast";

const DeleteModal = ({ auction, onConfirm, onCancel, loading }) => (
  <AnimatePresence>
    {auction && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative glass rounded-2xl p-6 w-full max-w-md border border-red-500/20 z-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
              <AlertTriangle className="text-red-400 w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold font-heading text-lg">Delete Auction</h3>
              <p className="text-gray-400 text-sm">This action cannot be undone</p>
            </div>
          </div>
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete{" "}
            <span className="text-white font-medium">"{auction.title}"</span>?
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Trash2 size={16} />
                  Delete
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const AuctionManageCard = ({ auction, onEdit, onDelete, onView }) => {
  const statusVariant = {
    live: "live",
    scheduled: "scheduled",
    ended: "ended",
    cancelled: "default",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl border border-white/10 hover:border-white/20 transition-all overflow-hidden"
    >
      <div className="flex items-center gap-4 p-4">
        {/* Image */}
        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-white/5">
          <img
            src={getImageUrl(auction.images)}
            alt={auction.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant={statusVariant[auction.status]}>
              {auction.status}
            </Badge>
            <Badge variant="gold">{auction.category}</Badge>
          </div>
          <h3 className="font-semibold font-heading truncate">{auction.title}</h3>
          <div className="flex items-center gap-4 mt-1 flex-wrap">
            <span className="text-gold-400 font-bold text-sm">
              {formatCurrency(auction.currentPrice)}
            </span>
            <span className="text-gray-500 text-xs">
              {auction.totalBids} bids
            </span>
            <span className="text-gray-500 text-xs">
              Ends {formatDate(auction.endTime)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onView(auction._id)}
            className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors"
            title="View"
          >
            <Eye size={15} className="text-gray-300" />
          </motion.button>

          {/* Edit — for live and scheduled */}
          {(auction.status === "live" || auction.status === "scheduled") && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(auction._id)}
              className="w-9 h-9 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/30 rounded-xl flex items-center justify-center transition-colors"
              title="Edit"
            >
              <Pencil size={15} className="text-blue-400" />
            </motion.button>
          )}

          {/* Delete — for all statuses */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(auction)}
            className="w-9 h-9 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 rounded-xl flex items-center justify-center transition-colors"
            title="Delete"
          >
            <Trash2 size={15} className="text-red-400" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { user } = useAuthStore();
  const { myAuctions, fetchMyAuctions, loading } = useAuctionStore();
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchMyAuctions();
  }, []);

  const live = myAuctions.filter((a) => a.status === "live");
  const scheduled = myAuctions.filter((a) => a.status === "scheduled");
  const ended = myAuctions.filter((a) => a.status === "ended");
  const totalValue = myAuctions.reduce((sum, a) => sum + a.currentPrice, 0);
  const totalBids = myAuctions.reduce((sum, a) => sum + a.totalBids, 0);

  const filteredAuctions =
    activeTab === "all"
      ? myAuctions
      : myAuctions.filter((a) => a.status === activeTab);

  const stats = [
    { icon: Gavel, label: "Total Auctions", value: myAuctions.length, color: "text-gold-400", bg: "bg-gold-500/10" },
    { icon: TrendingUp, label: "Live Now", value: live.length, color: "text-green-400", bg: "bg-green-500/10" },
    { icon: Clock, label: "Scheduled", value: scheduled.length, color: "text-blue-400", bg: "bg-blue-500/10" },
    { icon: CheckCircle, label: "Completed", value: ended.length, color: "text-gray-400", bg: "bg-gray-500/10" },
  ];

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/auctions/${deleteTarget._id}`);
      toast.success("Auction deleted successfully");
      fetchMyAuctions();
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  };

  const tabs = [
    { key: "all", label: "All", count: myAuctions.length },
    { key: "live", label: "Live", count: live.length },
    { key: "scheduled", label: "Scheduled", count: scheduled.length },
    { key: "ended", label: "Ended", count: ended.length },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <DeleteModal
        auction={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold font-heading">
              Welcome back,{" "}
              <span className="gold-text">{user?.name?.split(" ")[0]}</span>
            </h1>
            <p className="text-gray-400 mt-1 capitalize">{user?.role} Dashboard</p>
          </div>
          {user?.role === "seller" && (
            <Link to="/create-auction">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-bold px-5 py-2.5 rounded-xl transition-all gold-glow"
              >
                <Plus size={18} />
                New Auction
              </motion.button>
            </Link>
          )}
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map(({ icon: Icon, label, value, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`${color} w-5 h-5`} />
              </div>
              <div className="text-2xl font-bold font-heading">{value}</div>
              <div className="text-gray-400 text-sm mt-1">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Revenue + Bids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-6 border border-gold-500/20 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-gold-500/10 rounded-xl flex items-center justify-center">
              <DollarSign className="text-gold-400 w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Auction Value</p>
              <p className="text-3xl font-bold gold-text font-heading">
                {formatCurrency(totalValue)}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-6 border border-purple-500/20 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-purple-400 w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Bids Received</p>
              <p className="text-3xl font-bold font-heading text-purple-400">
                {totalBids}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Auction Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-xl font-bold font-heading mb-4">
            Manage Auctions
          </h2>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {tabs.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === key
                    ? "bg-gold-500/20 border border-gold-500 text-gold-400"
                    : "bg-white/5 border border-white/10 text-gray-300 hover:border-white/20"
                }`}
              >
                {label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === key ? "bg-gold-500/30" : "bg-white/10"
                  }`}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* List */}
          {loading ? (
            <Loader />
          ) : filteredAuctions.length === 0 ? (
            <div className="glass rounded-2xl p-12 border border-white/10 text-center">
              <Gavel className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2 font-medium">No auctions found</p>
              <p className="text-gray-500 text-sm mb-6">
                {activeTab === "all"
                  ? "Create your first auction to get started"
                  : `No ${activeTab} auctions`}
              </p>
              {activeTab === "all" && user?.role === "seller" && (
                <Link to="/create-auction">
                  <button className="bg-gold-500 text-black font-semibold px-6 py-2.5 rounded-xl hover:bg-gold-600 transition-colors inline-flex items-center gap-2">
                    <Plus size={16} />
                    Create Auction
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAuctions.map((auction) => (
                <AuctionManageCard
                  key={auction._id}
                  auction={auction}
                  onView={(id) => navigate(`/auctions/${id}`)}
                  onEdit={(id) => navigate(`/auctions/${id}/edit`)}
                  onDelete={(auction) => setDeleteTarget(auction)}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;