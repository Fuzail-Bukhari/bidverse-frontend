const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-white/10 text-white",
    gold: "bg-gold-500/20 text-gold-400 border border-gold-500/30",
    live: "bg-red-500/20 text-red-400 border border-red-500/30",
    scheduled: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    ended: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
    success: "bg-green-500/20 text-green-400 border border-green-500/30",
  };

  return (
    <span className={`
      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
      ${variants[variant]} ${className}
    `}>
      {variant === "live" && (
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 live-badge" />
      )}
      {children}
    </span>
  );
};

export default Badge;