import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Gavel, ImagePlus, X } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { CATEGORIES } from "../utils/constants";
import api from "../utils/axios";
import toast from "react-hot-toast";
import AIListingGenerator from "../components/ai/AIListingGenerator";

const DURATION_OPTIONS = [
  { label: "1 Hour", hours: 1 },
  { label: "6 Hours", hours: 6 },
  { label: "12 Hours", hours: 12 },
  { label: "1 Day", hours: 24 },
  { label: "3 Days", hours: 72 },
  { label: "7 Days", hours: 168 },
  { label: "Custom", hours: 0 },
];

const CreateAuction = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState(24);
  const [customEnd, setCustomEnd] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Electronics",
    startingPrice: "",
    reservePrice: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ ADD THIS FUNCTION - AI Apply handler
  const handleAIApply = (listing) => {
    setForm({
      title: listing.title || form.title,
      description: listing.description || form.description,
      category: listing.category || form.category,
      startingPrice: listing.suggestedStartingPrice || form.startingPrice,
      reservePrice: form.reservePrice,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB`);
        return false;
      }
      return true;
    });
    setImages((prev) => [...prev, ...validFiles]);
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => setPreviews((prev) => [...prev, e.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const getEndTime = () => {
    if (isCustom && customEnd) return new Date(customEnd).toISOString();
    const end = new Date();
    end.setHours(end.getHours() + selectedDuration);
    return end.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append("startTime", new Date().toISOString());
      formData.append("endTime", getEndTime());
      images.forEach((image) => formData.append("images", image));

      const res = await api.post("/auctions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Auction is now live! 🔥");
      navigate(`/auctions/${res.data.auction._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create auction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500/10 rounded-2xl border border-gold-500/20 mb-4">
              <Gavel className="text-gold-400 w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold font-heading">Create Auction</h1>
            <p className="text-gray-400 mt-2">Your auction goes live immediately</p>
          </div>

          <div className="glass rounded-3xl p-8 border border-white/10">
            {/* ✅ ADD THIS COMPONENT - Right above the form opening tag */}
            <AIListingGenerator onApply={handleAIApply} />

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">
                  Product Images
                  <span className="text-gray-500 ml-2">({images.length}/5)</span>
                </label>
                <label className={`
                  relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all group
                  ${images.length >= 5
                    ? "border-gray-700 cursor-not-allowed opacity-50"
                    : "border-white/20 hover:border-gold-500/50 hover:bg-gold-500/5"
                  }
                `}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={images.length >= 5}
                    className="hidden"
                  />
                  <ImagePlus className="w-10 h-10 text-gray-500 mx-auto mb-3 group-hover:text-gold-400 transition-colors" />
                  <p className="text-gray-400 text-sm">Click to upload images</p>
                  <p className="text-gray-600 text-xs mt-1">PNG, JPG, WEBP up to 5MB each</p>
                </label>

                <AnimatePresence>
                  {previews.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="grid grid-cols-5 gap-2 mt-2"
                    >
                      {previews.map((preview, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group aspect-square"
                        >
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-xl border border-white/10"
                          />
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 text-xs bg-gold-500 text-black px-1.5 py-0.5 rounded-md font-medium">
                              Main
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Input
                label="Auction Title"
                name="title"
                placeholder="iPhone 14 Pro Max - 256GB"
                value={form.title}
                onChange={handleChange}
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">Description</label>
                <textarea
                  name="description"
                  placeholder="Describe your item in detail..."
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all resize-none"
                />
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Starting Price ($)"
                  name="startingPrice"
                  type="number"
                  placeholder="100"
                  value={form.startingPrice}
                  onChange={handleChange}
                  required
                  min="1"
                />
                <Input
                  label="Reserve Price ($)"
                  name="reservePrice"
                  type="number"
                  placeholder="Optional"
                  value={form.reservePrice}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              {/* Duration Picker */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">
                  Auction Duration
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {DURATION_OPTIONS.map(({ label, hours }) => (
                    <motion.button
                      key={label}
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        if (hours === 0) {
                          setIsCustom(true);
                        } else {
                          setIsCustom(false);
                          setSelectedDuration(hours);
                        }
                      }}
                      className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        (hours === 0 && isCustom) || (!isCustom && selectedDuration === hours)
                          ? "bg-gold-500/20 border-gold-500 text-gold-400"
                          : "bg-white/5 border-white/10 text-gray-300 hover:border-gold-500/30"
                      }`}
                    >
                      {label}
                    </motion.button>
                  ))}
                </div>

                {/* Custom end time */}
                <AnimatePresence>
                  {isCustom && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Input
                        label="Custom End Date & Time"
                        type="datetime-local"
                        value={customEnd}
                        onChange={(e) => setCustomEnd(e.target.value)}
                        required={isCustom}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Preview end time */}
                {!isCustom && (
                  <p className="text-gray-500 text-xs">
                    Auction ends:{" "}
                    <span className="text-gold-400">
                      {(() => {
                        const end = new Date();
                        end.setHours(end.getHours() + selectedDuration);
                        return end.toLocaleString();
                      })()}
                    </span>
                  </p>
                )}
              </div>

              {/* Goes Live Badge */}
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-green-400 text-sm font-medium">
                  Your auction will go live immediately after posting
                </p>
              </div>

              <Button type="submit" loading={loading} size="lg" className="w-full">
                <Gavel size={18} />
                Post Auction Live
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateAuction;