import { useState } from "react";
import api from "../utils/axios";
import toast from "react-hot-toast";

const useBid = (auctionId, onSuccess) => {
  const [loading, setLoading] = useState(false);

  const placeBid = async (amount) => {
    setLoading(true);
    try {
      const res = await api.post(`/bids/${auctionId}`, { amount });
      toast.success(`Bid of $${amount} placed successfully!`);
      if (onSuccess) onSuccess(res.data);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to place bid";
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { placeBid, loading };
};

export default useBid;