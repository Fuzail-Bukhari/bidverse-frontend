import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import AuctionGrid from "../components/auction/AuctionGrid";
import useAuctionStore from "../store/auctionStore";
import { CATEGORIES } from "../utils/constants";

const statuses = ["all", "live", "scheduled", "ended"];
const sortOptions = [
  { label: "Newest", value: "" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Ending Soon", value: "ending_soon" },
];

const Auctions = () => {
  const { auctions, fetchAuctions, loading } = useAuctionStore();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    const filters = {};
    if (search) filters.search = search;
    if (status !== "all") filters.status = status;
    if (category) filters.category = category;
    if (sort) filters.sort = sort;
    fetchAuctions(filters);
  }, [search, status, category, sort]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold font-heading mb-2">
            All <span className="gold-text">Auctions</span>
          </h1>
          <p className="text-gray-400">
            {auctions.length} auctions available
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-4 border border-white/10 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search auctions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-gold-500 transition-all text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                    status === s
                      ? "bg-gold-500/20 border border-gold-500 text-gold-400"
                      : "bg-white/5 border border-white/10 text-gray-300 hover:border-white/20"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-gray-300 outline-none focus:border-gold-500 transition-all text-sm"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-gray-300 outline-none focus:border-gold-500 transition-all text-sm"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Grid */}
        <AuctionGrid auctions={auctions} loading={loading} />
      </div>
    </div>
  );
};

export default Auctions;