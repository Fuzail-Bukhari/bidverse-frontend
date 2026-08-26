import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Gavel, X, ImagePlus, AlertCircle, Info } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import { CATEGORIES } from "../utils/constants";
import api from "../utils/axios";
import toast from "react-hot-toast";

const EditAuction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [auctionStatus, setAuctionStatus] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Electronics",
    startingPrice: "",
    reservePrice: "",
    endTime: "",
  });

  useEffect(() => {
    fetchAuction();
  }, [id]);

  const fetchAuction = async () => {
    try {
      const res = await api.get(`/auctions/${id}`);
      const auction = res.data.auction;
      setAuctionStatus(auction.status);
      setExistingImages(auction.images || []);
      setForm({
        title: auction.title,
        description: auction.description,
        category: auction.category,
        startingPrice: auction.startingPrice,
        reservePrice: auction.reservePrice,
        endTime: new Date(auction.endTime).toISOString().slice(0, 16),
      });
    } catch {
      toast.error("Failed to load auction");
      navigate(-1);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    const total = existingImages.length + newImages.length + files.length;
    if (total > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    const valid = files.filter((f) => {
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name} exceeds 5MB`);
        return false;
      }
      return true;
    });
    setNewImages((prev) => [...prev, ...valid]);
    valid.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => setNewPreviews((prev) => [...prev, e.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeExisting = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNew = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();

      if (auctionStatus === "live") {
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("endTime", form.endTime);
      } else {
        Object.entries(form).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }

      formData.append("keepImages", JSON.stringify(existingImages));
      newImages.forEach((img) => formData.append("images", img));

      await api.put(`/auctions/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Auction updated successfully!");
      navigate(`/auctions/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loader fullScreen />;

  const totalImages = existingImages.length + newImages.length;
  const isLive = auctionStatus === "live";
  const isEnded = auctionStatus === "ended";

  const statusColors = {
    live: "text-green-400 bg-green-500/10 border-green-500/20",
    scheduled: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    ended: "text-gray-400 bg-gray-500/10 border-gray-500/20",
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500/10 rounded-2xl border border-gold-500/20 mb-4">
              <Gavel className="text-gold-400 w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold font-heading">Edit Auction</h1>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm mt-2 ${statusColors[auctionStatus]}`}>
              {isLive && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
              {auctionStatus.charAt(0).toUpperCase() + auctionStatus.slice(1)}
            </div>
          </div>

          {/* Info banner based on status */}
          {isLive && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-6"
            >
              <AlertCircle className="text-yellow-400 w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <p className="text-yellow-400 font-medium text-sm">Live Auction — Limited Editing</p>
                <p className="text-gray-400 text-xs mt-1">
                  Only title, description, end time and images can be edited while live. Price and category are locked.
                </p>
              </div>
            </motion.div>
          )}

          {isEnded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6"
            >
              <Info className="text-blue-400 w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <p className="text-blue-400 font-medium text-sm">Ended Auction</p>
                <p className="text-gray-400 text-xs mt-1">
                  This auction has ended. You can only update images and description for reference.
                </p>
              </div>
            </motion.div>
          )}

          <div className="glass rounded-3xl p-8 border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Images */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-gray-300">
                  Images <span className="text-gray-500">({totalImages}/5)</span>
                </label>

                {existingImages.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Current Images</p>
                    <div className="grid grid-cols-5 gap-2">
                      {existingImages.map((url, index) => (
                        <div key={url} className="relative group aspect-square">
                          <img src={url} alt="" className="w-full h-full object-cover rounded-xl border border-white/10" />
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 text-xs bg-gold-500 text-black px-1.5 py-0.5 rounded-md font-medium">Main</span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeExisting(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {newPreviews.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">New Images</p>
                    <div className="grid grid-cols-5 gap-2">
                      {newPreviews.map((preview, index) => (
                        <div key={index} className="relative group aspect-square">
                          <img src={preview} alt="" className="w-full h-full object-cover rounded-xl border border-gold-500/30" />
                          <button
                            type="button"
                            onClick={() => removeNew(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {totalImages < 5 && (
                  <label className="border-2 border-dashed border-white/20 hover:border-gold-500/50 rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-gold-500/5 group">
                    <input type="file" accept="image/*" multiple onChange={handleNewImages} className="hidden" />
                    <ImagePlus className="w-8 h-8 text-gray-500 mx-auto mb-2 group-hover:text-gold-400 transition-colors" />
                    <p className="text-gray-400 text-sm">Add images</p>
                    <p className="text-gray-600 text-xs mt-1">{5 - totalImages} slots remaining</p>
                  </label>
                )}
              </div>

              {/* Title — always editable */}
              <Input
                label="Auction Title"
                name="title"
                placeholder="iPhone 14 Pro Max"
                value={form.title}
                onChange={handleChange}
                required
              />

              {/* Description — always editable */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all resize-none"
                />
              </div>

              {/* Category — locked for live/ended */}
              {!isLive && !isEnded && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-300">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-gold-500 transition-all"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-dark-3">{c}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price — locked for live/ended */}
              {!isLive && !isEnded && (
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Starting Price ($)"
                    name="startingPrice"
                    type="number"
                    value={form.startingPrice}
                    onChange={handleChange}
                    required
                    min="1"
                  />
                  <Input
                    label="Reserve Price ($)"
                    name="reservePrice"
                    type="number"
                    value={form.reservePrice}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              )}

              {/* End Time — editable for live and scheduled */}
              {!isEnded && (
                <Input
                  label="End Time"
                  name="endTime"
                  type="datetime-local"
                  value={form.endTime}
                  onChange={handleChange}
                  required
                />
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={loading} size="lg" className="flex-1">
                  <Gavel size={18} />
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditAuction;