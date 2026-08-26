import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const FloatingHammer = ({ size = 80 }) => {
  const ref = useRef(null);

  useEffect(() => {
    gsap.to(ref.current, {
      y: -15,
      rotation: 5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });
  }, []);

  return (
    <div ref={ref} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="55" y="15" width="30" height="20" rx="3"
          fill="#f59e0b" stroke="#fcd34d" strokeWidth="1"
        />
        <rect
          x="60" y="10" width="20" height="10" rx="2"
          fill="#d97706"
        />
        <line
          x1="55" y1="30" x2="20" y2="75"
          stroke="#8B4513" strokeWidth="6" strokeLinecap="round"
        />
        <circle cx="20" cy="75" r="4" fill="#6b3410" />
        <rect
          x="56" y="16" width="28" height="8" rx="2"
          fill="#fcd34d" opacity="0.4"
        />
      </svg>
    </div>
  );
};

export default FloatingHammer;