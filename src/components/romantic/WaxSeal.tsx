import React from "react";
import { Heart } from "lucide-react";

interface WaxSealProps {
  size?: "sm" | "md" | "lg";
  monogram?: string;
  showHeart?: boolean;
  className?: string;
}

export function WaxSeal({
  size = "md",
  monogram = "M & L",
  showHeart = true,
  className = "",
}: WaxSealProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-[9px]",
    md: "w-12 h-12 text-[11px]",
    lg: "w-16 h-16 text-xs",
  }[size];

  const heartSizes = {
    sm: "w-2.5 h-2.5",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full wax-seal-badge select-none font-serif text-[#FBF6EE] font-medium tracking-wider transition-all duration-300 hover:scale-105 ${sizeClasses} ${className}`}
      title="Sello de correspondencia privada • Mili & Lolo"
    >
      <div className="absolute inset-1 rounded-full border border-[#FAF8F5]/30 pointer-events-none" />
      <div className="flex flex-col items-center justify-center -space-y-0.5">
        {showHeart ? (
          <Heart className={`${heartSizes} fill-[#FBF6EE]/80 text-transparent animate-heart-pulse`} />
        ) : (
          <span>{monogram}</span>
        )}
      </div>
    </div>
  );
}
