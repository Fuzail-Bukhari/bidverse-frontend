import { create } from "zustand";
import api from "../utils/axios";

const useAuctionStore = create((set, get) => ({
  auctions: [],
  currentAuction: null,
  myAuctions: [],
  loading: false,
  error: null,

  fetchAuctions: async (filters = {}) => {
    set({ loading: true });
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await api.get(`/auctions?${params}`);
      set({ auctions: res.data.auctions, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchAuction: async (id) => {
    set({ loading: true });
    try {
      const res = await api.get(`/auctions/${id}`);
      set({ currentAuction: res.data.auction, loading: false });
      return res.data.auction;
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchMyAuctions: async () => {
    try {
      const res = await api.get("/auctions/my");
      set({ myAuctions: res.data.auctions });
    } catch (err) {
      set({ error: err.message });
    }
  },

  createAuction: async (data) => {
    const res = await api.post("/auctions", data);
    return res.data.auction;
  },

  updateCurrentPrice: (auctionId, newPrice, totalBids) => {
    const { currentAuction, auctions } = get();
    if (currentAuction?._id === auctionId) {
      set({
        currentAuction: {
          ...currentAuction,
          currentPrice: newPrice,
          totalBids,
        },
      });
    }
    set({
      auctions: auctions.map((a) =>
        a._id === auctionId ? { ...a, currentPrice: newPrice, totalBids } : a
      ),
    });
  },
}));

export default useAuctionStore;