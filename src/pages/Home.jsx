import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Gavel, Shield, Zap, TrendingUp,
  ArrowRight, Star, Users, DollarSign
} from "lucide-react";
import HeroScene from "../components/3d/HeroScene";
import AuctionGrid from "../components/auction/AuctionGrid";
import useAuctionStore from "../store/auctionStore";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: Users, label: "Active Bidders", value: "12,400+" },
  { icon: Gavel, label: "Auctions Completed", value: "8,200+" },
  { icon: DollarSign, label: "Total Volume", value: "$4.2M+" },
  { icon: Star, label: "Satisfaction Rate", value: "99.1%" },
];

const features = [
  {
    icon: Zap,
    title: "Real-Time Bidding",
    description: "Experience the thrill of live auctions with instant bid updates powered by WebSockets.",
  },
  {
    icon: Shield,
    title: "Secure & Trusted",
    description: "Every transaction is protected with enterprise-grade security and JWT authentication.",
  },
  {
    icon: TrendingUp,
    title: "Smart Pricing",
    description: "AI-powered price predictions help you make smarter bidding decisions every time.",
  },
];

const Home = () => {
  const { auctions, fetchAuctions, loading } = useAuctionStore();
  const statsRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    fetchAuctions({ status: "live" });
  }, []);

  useEffect(() => {
    // GSAP scroll animations
    gsap.fromTo(
      ".stat-card",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
        },
      }
    );

    gsap.fromTo(
      ".feature-card",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  const liveAuctions = auctions.filter((a) => a.status === "live").slice(0, 4);

  return (
    <div className="gradient-bg">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <HeroScene />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/50 to-transparent z-10" />

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full border border-gold-500/30 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 live-badge" />
              <span className="text-sm text-gray-300">
                {liveAuctions.length} Live Auctions Right Now
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-6xl md:text-7xl font-bold font-heading leading-tight mb-6"
            >
              Bid. Win.{" "}
              <span className="gold-text">Conquer.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400 text-xl leading-relaxed mb-8"
            >
              The most electrifying real-time auction platform. 
              Discover rare items, place live bids, and win with confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/auctions">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-bold px-8 py-4 rounded-2xl text-lg transition-all gold-glow"
                >
                  Explore Auctions
                  <ArrowRight size={20} />
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 glass border border-white/20 hover:border-gold-500/50 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all"
                >
                  Start Selling
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-gray-500 text-xs">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 border-2 border-gray-600 rounded-full flex items-start justify-center pt-1"
          >
            <div className="w-1 h-2 bg-gold-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="stat-card glass rounded-2xl p-6 border border-white/10 text-center"
              >
                <Icon className="text-gold-400 w-8 h-8 mx-auto mb-3" />
                <div className="text-3xl font-bold gold-text font-heading mb-1">
                  {value}
                </div>
                <div className="text-gray-400 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Auctions */}
      {liveAuctions.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-red-400 live-badge" />
                  <span className="text-red-400 text-sm font-medium">Live Now</span>
                </div>
                <h2 className="text-4xl font-bold font-heading">
                  Active Auctions
                </h2>
              </div>
              <Link to="/auctions">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 text-gold-400 hover:text-gold-300 font-medium transition-colors"
                >
                  View All <ArrowRight size={16} />
                </motion.button>
              </Link>
            </div>
            <AuctionGrid auctions={liveAuctions} loading={loading} />
          </div>
        </section>
      )}

      {/* Features */}
      <section ref={featuresRef} className="py-20" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading mb-4">
              Why Choose <span className="gold-text">BidVerse?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Built for serious bidders and sellers who demand the best experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="feature-card glass rounded-2xl p-8 border border-white/10 hover:border-gold-500/30 transition-all group"
              >
                <div className="w-14 h-14 bg-gold-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gold-500/20 transition-colors">
                  <Icon className="text-gold-400 w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-heading mb-3">{title}</h3>
                <p className="text-gray-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 border border-gold-500/20 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-purple-500/5" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
                Ready to Start Bidding?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of bidders and sellers on the most exciting auction platform.
              </p>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gold-500 hover:bg-gold-600 text-black font-bold px-10 py-4 rounded-2xl text-lg transition-all gold-glow inline-flex items-center gap-2"
                >
                  Create Free Account
                  <ArrowRight size={20} />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;