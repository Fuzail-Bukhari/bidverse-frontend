import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Gavel, TrendingUp, DollarSign,
  Shield, Search, Trash2, Edit2,
  CheckCircle, XCircle, Crown, Eye,
  BarChart2, AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import toast from "react-hot-toast";
import { formatCurrency, formatDate, getImageUrl } from "../utils/helpers";
import Badge from "../components/ui/Badge";
import Loader from "../components/ui/Loader";

const StatCard = ({ icon: Icon, label, value, color, bg, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass rounded-2xl p-5 border border-white/10"
  >
    <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
      <Icon className={`${color} w-5 h-5`} />
    </div>
    <div className="text-2xl font-bold font-heading">{value}</div>
    <div className="text-gray-400 text-sm mt-1">{label}</div>
  </motion.div>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState("");
  const [searchAuction, setSearchAuction] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [auctionStatusFilter, setAuctionStatusFilter] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "auctions") fetchAuctions();
  }, [activeTab, searchUser, searchAuction, userRoleFilter, auctionStatusFilter]);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data.stats);
    } catch (err) {
      toast.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (searchUser) params.append("search", searchUser);
      if (userRoleFilter) params.append("role", userRoleFilter);
      const res = await api.get(`/admin/users?${params}`);
      setUsers(res.data.users);
    } catch (err) {
      toast.error("Failed to load users");
    }
  };

  const fetchAuctions = async () => {
    try {
      const params = new URLSearchParams();
      if (searchAuction) params.append("search", searchAuction);
      if (auctionStatusFilter) params.append("status", auctionStatusFilter);
      const res = await api.get(`/admin/auctions?${params}`);
      setAuctions(res.data.auctions);
    } catch (err) {
      toast.error("Failed to load auctions");
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role });
      toast.success("Role updated");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/toggle-status`);
      toast.success(res.data.message);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to toggle status");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  const handleAuctionStatus = async (auctionId, status) => {
    try {
      await api.patch(`/admin/auctions/${auctionId}/status`, { status });
      toast.success("Auction status updated");
      fetchAuctions();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteAuction = async (auctionId) => {
    if (!window.confirm("Delete this auction permanently?")) return;
    try {
      await api.delete(`/auctions/${auctionId}`);
      toast.success("Auction deleted");
      fetchAuctions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  const tabs = [
    { key: "overview", label: "Overview", icon: BarChart2 },
    { key: "users", label: "Users", icon: Users },
    { key: "auctions", label: "Auctions", icon: Gavel },
  ];

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-12 h-12 bg-gold-500/10 rounded-2xl flex items-center justify-center border border-gold-500/20">
            <Crown className="text-gold-400 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-heading">
              Admin <span className="gold-text">Dashboard</span>
            </h1>
            <p className="text-gray-400">Manage the entire BidVerse platform</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === key
                  ? "bg-gold-500/20 border border-gold-500 text-gold-400"
                  : "glass border border-white/10 text-gray-300 hover:border-white/20"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="text-blue-400" bg="bg-blue-500/10" delay={0} />
              <StatCard icon={Gavel} label="Total Auctions" value={stats.totalAuctions} color="text-gold-400" bg="bg-gold-500/10" delay={0.1} />
              <StatCard icon={TrendingUp} label="Live Auctions" value={stats.liveAuctions} color="text-green-400" bg="bg-green-500/10" delay={0.2} />
              <StatCard icon={DollarSign} label="Total Revenue" value={formatCurrency(stats.totalRevenue)} color="text-purple-400" bg="bg-purple-500/10" delay={0.3} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Buyers" value={stats.totalBuyers} color="text-cyan-400" bg="bg-cyan-500/10" delay={0.4} />
              <StatCard icon={Shield} label="Sellers" value={stats.totalSellers} color="text-orange-400" bg="bg-orange-500/10" delay={0.5} />
              <StatCard icon={CheckCircle} label="Ended Auctions" value={stats.endedAuctions} color="text-gray-400" bg="bg-gray-500/10" delay={0.6} />
              <StatCard icon={TrendingUp} label="Total Bids" value={stats.totalBids} color="text-pink-400" bg="bg-pink-500/10" delay={0.7} />
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="glass rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-gold-500 transition-all text-sm"
                />
              </div>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-gray-300 outline-none focus:border-gold-500 text-sm"
              >
                <option value="">All Roles</option>
                <option value="buyer">Buyers</option>
                <option value="seller">Sellers</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            {/* Users Table */}
            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-4 py-3 text-gray-400 text-sm font-medium">User</th>
                      <th className="text-left px-4 py-3 text-gray-400 text-sm font-medium">Role</th>
                      <th className="text-left px-4 py-3 text-gray-400 text-sm font-medium">Status</th>
                      <th className="text-left px-4 py-3 text-gray-400 text-sm font-medium">Joined</th>
                      <th className="text-left px-4 py-3 text-gray-400 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gold-500/20 flex items-center justify-center overflow-hidden">
                              {user.avatar ? (
                                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-gold-400 font-bold text-sm">
                                  {user.name?.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{user.name}</p>
                              <p className="text-gray-400 text-xs">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-gray-300 outline-none focus:border-gold-500"
                            disabled={user.role === "admin"}
                          >
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            user.isActive !== false
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}>
                            {user.isActive !== false ? "Active" : "Suspended"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleStatus(user._id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                user.isActive !== false
                                  ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                                  : "bg-green-500/20 hover:bg-green-500/30 text-green-400"
                              }`}
                              title={user.isActive !== false ? "Suspend" : "Activate"}
                            >
                              {user.isActive !== false ? <XCircle size={15} /> : <CheckCircle size={15} />}
                            </button>
                            {user.role !== "admin" && (
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                                title="Delete User"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="text-center py-12 text-gray-400">No users found</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Auctions Tab */}
        {activeTab === "auctions" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="glass rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search auctions..."
                  value={searchAuction}
                  onChange={(e) => setSearchAuction(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-gold-500 transition-all text-sm"
                />
              </div>
              <select
                value={auctionStatusFilter}
                onChange={(e) => setAuctionStatusFilter(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-gray-300 outline-none focus:border-gold-500 text-sm"
              >
                <option value="">All Status</option>
                <option value="live">Live</option>
                <option value="scheduled">Scheduled</option>
                <option value="ended">Ended</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Auctions Table */}
            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-4 py-3 text-gray-400 text-sm font-medium">Auction</th>
                      <th className="text-left px-4 py-3 text-gray-400 text-sm font-medium">Seller</th>
                      <th className="text-left px-4 py-3 text-gray-400 text-sm font-medium">Winner</th>
                      <th className="text-left px-4 py-3 text-gray-400 text-sm font-medium">Price</th>
                      <th className="text-left px-4 py-3 text-gray-400 text-sm font-medium">Status</th>
                      <th className="text-left px-4 py-3 text-gray-400 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auctions.map((auction) => (
                      <tr key={auction._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 shrink-0">
                              <img
                                src={getImageUrl(auction.images)}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{auction.title}</p>
                              <p className="text-gray-400 text-xs">{auction.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{auction.sellerId?.name}</p>
                          <p className="text-gray-400 text-xs">{auction.sellerId?.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          {auction.status === "ended" ? (
                            auction.winnerId ? (
                              <>
                                <p className="text-sm text-green-400">{auction.winnerId.name}</p>
                                <p className="text-gray-400 text-xs">{auction.winnerId.email}</p>
                              </>
                            ) : (
                              <span className="text-gray-500 text-xs">No winner</span>
                            )
                          ) : (
                            <span className="text-gray-500 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gold-400 font-bold text-sm">
                            {formatCurrency(auction.currentPrice)}
                          </p>
                          <p className="text-gray-400 text-xs">{auction.totalBids} bids</p>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={auction.status}
                            onChange={(e) => handleAuctionStatus(auction._id, e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-gray-300 outline-none focus:border-gold-500"
                          >
                            <option value="live">Live</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="ended">Ended</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link to={`/auctions/${auction._id}`}>
                              <button className="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors">
                                <Eye size={15} />
                              </button>
                            </Link>
                            <Link to={`/auctions/${auction._id}/edit`}>
                              <button className="p-1.5 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-400 transition-colors">
                                <Edit2 size={15} />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDeleteAuction(auction._id)}
                              className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {auctions.length === 0 && (
                  <div className="text-center py-12 text-gray-400">No auctions found</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;