import { Heart } from "lucide-react";
import { WaxSeal } from "@/components/romantic/WaxSeal";

export function QuoteInterlude() {
  return (
    <section className="relative py-20 bg-[#F4EFE6]/50 border-b border-[#E6DFD3] overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
        <div className="flex justify-center">
          <WaxSeal size="sm" showHeart={true} />
        </div>

        <p className="font-serif italic text-2xl sm:text-3xl text-[#1C1A17] font-normal leading-relaxed max-w-2xl mx-auto">
          «Hay recuerdos que no envejecen nunca: sólo esperan a que volvamos a
          abrir estas páginas para volver a iluminarnos la mirada.»
        </p>

        <div className="pt-2 flex items-center justify-center space-x-3 text-xs tracking-widest uppercase text-[#827B73]">
          <span className="h-px w-6 bg-[#D6CEBF]" />
          <span className="flex items-center space-x-1.5">
            <Heart className="w-3 h-3 fill-[#92543E] text-[#92543E] inline" />
            <span>Mili &amp; Lolo &bull; Anotación al Margen</span>
          </span>
          <span className="h-px w-6 bg-[#D6CEBF]" />
        </div>
      </div>
    </section>
  );
}
