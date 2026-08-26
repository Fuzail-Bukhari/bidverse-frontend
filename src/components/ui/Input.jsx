import { forwardRef } from "react";

const Input = forwardRef(({
  label,
  error,
  icon,
  className = "",
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-300">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
            text-white placeholder-gray-500 outline-none
            focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50
            transition-all duration-200
            ${icon ? "pl-10" : ""}
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/50" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;