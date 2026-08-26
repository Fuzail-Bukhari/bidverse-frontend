import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Upload, X, Loader, Tag,
  DollarSign, FileText, ChevronDown,
  ChevronUp, Check, RefreshCw,
} from "lucide-react";
import api from "../../utils/axios";
import toast from "react-hot-toast";

const AIListingGenerator = ({ onApply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const fileRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!keywords && !image) {
      toast.error("Please add an image or keywords");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      if (image) formData.append("image", image);
      if (keywords) formData.append("keywords", keywords);

      const res = await api.post("/ai/generate-listing", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data.listing);
      toast.success("AI listing generated! 🤖");
    } catch (err) {
      toast.error(err.response?.data?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (result && onApply) {
      onApply(result);
      setIsOpen(false);
      toast.success("Applied to your listing form!");
    }
  };

  const handleReset = () => {
    setImage(null);
    setPreview(null);
    setKeywords("");
    setResult(null);
  };

  return (
    <div className="mb-6">
      {/* Toggle Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 bg-gradient-to-r from-purple-500/10 to-gold-500/10 border border-purple-500/30 hover:border-purple-500/50 rounded-2xl px-5 py-4 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <Sparkles className="text-purple-400 w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-white text-sm">
              AI Listing Generator
            </p>
            <p className="text-gray-400 text-xs">
              Upload a photo or describe your item — AI does the rest
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/30">
            Powered by Claude AI
          </span>
          {isOpen ? (
            <ChevronUp size={18} className="text-gray-400" />
          ) : (
            <ChevronDown size={18} className="text-gray-400" />
          )}
        </div>
      </motion.button>

      {/* Expanded Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white/3 border border-white/10 border-t-0 rounded-b-2xl p-5 space-y-4">

              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Product Image (optional but recommended)
                </label>
                {preview ? (
                  <div className="relative inline-block">
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-xl border border-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setPreview(null);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/20 hover:border-purple-500/50 rounded-xl cursor-pointer transition-all hover:bg-purple-500/5 group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      ref={fileRef}
                    />
                    <Upload className="w-8 h-8 text-gray-500 mb-2 group-hover:text-purple-400 transition-colors" />
                    <p className="text-gray-400 text-sm">Click to upload image</p>
                    <p className="text-gray-600 text-xs">PNG, JPG up to 5MB</p>
                  </label>
                )}
              </div>

              {/* Keywords Input */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Describe your item in a few words
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g. vintage rolex watch gold, barely used..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm"
                />
              </div>

              {/* Generate Button */}
              <div className="flex gap-3">
                {result && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-sm text-gray-300"
                  >
                    <RefreshCw size={15} />
                    Reset
                  </motion.button>
                )}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerate}
                  disabled={loading || (!keywords && !image)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Generate with AI
                    </>
                  )}
                </motion.button>
              </div>

              {/* Result */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4 pt-2 border-t border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-purple-400 flex items-center gap-2">
                        <Sparkles size={14} />
                        AI Generated Results
                      </p>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleApply}
                        className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-bold px-4 py-2 rounded-xl text-sm transition-all"
                      >
                        <Check size={15} />
                        Apply to Form
                      </motion.button>
                    </div>

                    {/* Title */}
                    <div className="bg-white/5 rounded-xl p-4 space-y-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Title</p>
                      <p className="text-white font-semibold">{result.title}</p>
                    </div>

                    {/* Description */}
                    <div className="bg-white/5 rounded-xl p-4 space-y-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Description</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{result.description}</p>
                    </div>

                    {/* Grid Info */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <Tag size={16} className="text-gold-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Category</p>
                        <p className="text-white text-sm font-medium">{result.category}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <DollarSign size={16} className="text-green-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Starting Price</p>
                        <p className="text-white text-sm font-medium">${result.suggestedStartingPrice}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <FileText size={16} className="text-blue-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Condition</p>
                        <p className="text-white text-sm font-medium">{result.condition}</p>
                      </div>
                    </div>

                    {/* Highlights */}
                    {result.highlights && (
                      <div className="bg-white/5 rounded-xl p-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Key Highlights</p>
                        <ul className="space-y-1">
                          {result.highlights.map((h, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                              <Check size={14} className="text-green-400 shrink-0" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tags */}
                    {result.tags && (
                      <div className="flex flex-wrap gap-2">
                        {result.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2.5 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Seller Tip */}
                    {result.sellerTips && (
                      <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-3 flex items-start gap-2">
                        <Sparkles size={14} className="text-gold-400 mt-0.5 shrink-0" />
                        <p className="text-gold-300 text-xs">{result.sellerTips}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIListingGenerator;