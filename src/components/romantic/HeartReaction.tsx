"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface HeartReactionProps {
  initialCount?: number;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
}

export function HeartReaction({
  label = "Guardar en el corazón",
  size = "md",
  className = "",
}: HeartReactionProps) {
  const [loved, setLoved] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingParticle[]>([]);

  const triggerReaction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newParticle: FloatingParticle = {
      id: Date.now() + Math.random(),
      x,
      y,
    };

    setLoved(!loved);
    setFloatingHearts((prev) => [...prev.slice(-4), newParticle]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1200);
  };

  const isSmall = size === "sm";

  return (
    <button
      type="button"
      onClick={triggerReaction}
      aria-label={label}
      title={label}
      className={`group relative inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-[#E6DFD3] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#92543E]/30 ${
        loved
          ? "bg-[#F4EDE7] border-[#92543E]/60 text-[#92543E] shadow-sm"
          : "bg-[#FAF8F5] text-[#827B73] hover:text-[#92543E] hover:border-[#92543E]/40"
      } ${className}`}
    >
      <Heart
        className={`transition-transform duration-300 ${
          isSmall ? "w-3.5 h-3.5" : "w-4 h-4"
        } ${
          loved
            ? "fill-[#92543E] text-[#92543E] scale-110"
            : "text-[#9E978F] group-hover:text-[#92543E] group-hover:scale-110"
        }`}
      />
      <span className={`text-[11px] font-medium tracking-wide ${loved ? "text-[#92543E]" : "text-[#827B73]"}`}>
        {loved ? "En nuestro corazón" : "Recordar con cariño"}
      </span>

      {/* Mini partículas de corazones flotantes efímeras */}
      {floatingHearts.map((particle) => (
        <span
          key={particle.id}
          className="pointer-events-none absolute text-[#92543E] animate-fade-in-up"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y - 20}px`,
            transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <Heart className="w-3.5 h-3.5 fill-[#92543E]" />
        </span>
      ))}
    </button>
  );
}
