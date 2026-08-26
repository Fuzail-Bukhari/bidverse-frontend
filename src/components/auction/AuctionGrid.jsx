import AuctionCard from "./AuctionCard";
import Loader from "../ui/Loader";
import { motion } from "framer-motion";
import { PackageOpen } from "lucide-react";

const AuctionGrid = ({ auctions, loading }) => {
  if (loading) return <Loader />;

  if (!auctions || auctions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 gap-4"
      >
        <PackageOpen size={48} className="text-gray-600" />
        <p className="text-gray-400 text-lg font-medium">No auctions found</p>
        <p className="text-gray-500 text-sm">Try adjusting your filters</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {auctions.map((auction, index) => (
        <AuctionCard key={auction._id} auction={auction} index={index} />
      ))}
    </div>
  );
};

export default AuctionGrid;