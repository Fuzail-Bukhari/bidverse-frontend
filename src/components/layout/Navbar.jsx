import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gavel, Bell, Menu, X, User, LogOut,
  Plus, LayoutDashboard, ChevronDown,
  Crown, Shield,
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import api from "../../utils/axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchUnreadCount();
  }, [isAuthenticated]);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/notifications/unread-count");
      setUnreadCount(res.data.count);
    } catch {}
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications);
    } catch {}
  };

  const handleNotifOpen = () => {
    setNotifOpen(!notifOpen);
    if (!notifOpen) {
      fetchNotifications();
      setUnreadCount(0);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const navLinks = [
    { label: "Auctions", href: "/auctions" },
    { label: "How it Works", href: "/#how-it-works" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-white/10 shadow-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Gavel className="text-gold-500 w-7 h-7" />
            </motion.div>
            <span className="text-xl font-bold font-heading gold-text">
              BidVerse
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-gold-400 ${
                  location.pathname === link.href
                    ? "text-gold-400"
                    : "text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Create Auction — sellers only */}
                {user?.role === "seller" && (
                  <Link to="/create-auction">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="hidden md:flex items-center gap-2 bg-gold-500/20 hover:bg-gold-500/30 text-gold-400 border border-gold-500/30 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                    >
                      <Plus size={16} />
                      Create Auction
                    </motion.button>
                  </Link>
                )}

                {/* Notifications */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNotifOpen}
                    className="relative p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <Bell size={20} className="text-gray-300" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-12 w-80 glass rounded-2xl border border-white/10 overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                          <h3 className="font-semibold text-sm">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="text-xs text-gold-400">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-6 text-center text-gray-400 text-sm">
                              No notifications yet
                            </div>
                          ) : (
                            notifications.map((notif) => (
                              <div
                                key={notif._id}
                                className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${
                                  !notif.isRead ? "bg-gold-500/5" : ""
                                }`}
                              >
                                <p className="text-sm text-gray-300">
                                  {notif.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notif.createdAt).toLocaleTimeString()}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 glass px-3 py-2 rounded-xl border border-white/10"
                  >
                    <div className="w-7 h-7 rounded-full bg-gold-500/20 flex items-center justify-center overflow-hidden">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={14} className="text-gold-400" />
                      )}
                    </div>
                    <span className="text-sm font-medium hidden md:block">
                      {user?.name?.split(" ")[0]}
                    </span>
                    {user?.role === "admin" && (
                      <Shield size={12} className="text-gold-400 hidden md:block" />
                    )}
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-12 w-52 glass rounded-2xl border border-white/10 overflow-hidden z-50"
                      >
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="font-medium text-sm">{user?.name}</p>
                          <p className="text-gray-400 text-xs capitalize">
                            {user?.role}
                          </p>
                        </div>

                        {/* Dashboard */}
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-sm"
                        >
                          <LayoutDashboard size={16} className="text-gold-400" />
                          Dashboard
                        </Link>

                        {/* Admin Panel — admin only */}
                        {user?.role === "admin" && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-sm"
                          >
                            <Crown size={16} className="text-gold-400" />
                            Admin Panel
                          </Link>
                        )}

                        {/* Create Auction — seller only, mobile */}
                        {user?.role === "seller" && (
                          <Link
                            to="/create-auction"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-sm md:hidden"
                          >
                            <Plus size={16} className="text-gold-400" />
                            Create Auction
                          </Link>
                        )}

                        {/* Logout */}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors text-sm text-red-400 border-t border-white/10"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors hidden md:block"
                >
                  Login
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gold-500 hover:bg-gold-600 text-black font-semibold px-5 py-2 rounded-xl text-sm transition-all gold-glow"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/10"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-gray-300 hover:text-gold-400 py-2 text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-gold-400 hover:text-gold-300 py-2 text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Crown size={16} />
                  Admin Panel
                </Link>
              )}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-gold-400 py-2 text-sm font-medium transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;