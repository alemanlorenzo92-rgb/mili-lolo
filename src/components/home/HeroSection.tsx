import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, Calendar, Camera, Feather, Heart, MapPin, Plus, Sparkles } from "lucide-react";
import { WaxSeal } from "@/components/romantic/WaxSeal";

interface HeroSectionProps {
  featuredMemory?: {
    id: string;
    title: string;
    subtitle?: string | null;
    description: string;
    chapter?: string | null;
    date: Date;
    location?: string | null;
    coverUrl?: string | null;
    coverCaption?: string | null;
  } | null;
}

export function HeroSection({ featuredMemory }: HeroSectionProps) {
  const hasMemory = Boolean(featuredMemory);

  const title = featuredMemory?.title || "Mili & Lolo";
  const chapter = featuredMemory?.chapter || "Capítulo I &bull; Las páginas de nuestro camino";
  const quote = featuredMemory?.description
    ? `«${featuredMemory.description.slice(0, 190)}...»`
    : "«Donde cada instante juntos queda grabado para siempre: las risas improvisadas, las tardes lentas y las palabras sinceras que sólo nos pertenecen a nosotros dos.»";
  const location = featuredMemory?.location || "Nuestro rincón privado";
  const dateStr = featuredMemory?.date
    ? new Date(featuredMemory.date).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Edición Íntima &bull; Para nosotros dos";
  const coverUrl = featuredMemory?.coverUrl;
  const coverCaption =
    featuredMemory?.coverCaption || "Álbum fotográfico privado &bull; Mili y Lolo";

  return (
    <section className="relative overflow-hidden pt-8 sm:pt-14 pb-16 lg:pb-24 animate-fade-in-up">
      {/* Detalle decorativo de fondo */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="max-w-7xl mx-auto h-full px-6 sm:px-8 lg:px-12 grid grid-cols-4 md:grid-cols-12 gap-6">
          <div className="border-r border-[#E6DFD3]/60 h-full hidden lg:block" />
          <div className="border-r border-[#E6DFD3]/60 h-full hidden lg:block col-span-7" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Columna Editorial (7 cols en lg) */}
          <div className="lg:col-span-7 space-y-7 order-2 lg:order-1">
            
            <div className="inline-flex items-center space-x-3 text-xs tracking-[0.2em] uppercase text-[#827B73]">
              <span className="h-px w-8 bg-[#92543E]" />
              <span className="font-medium text-[#92543E] flex items-center space-x-1.5">
                <Heart className="w-3 h-3 fill-[#92543E] text-[#92543E] animate-heart-pulse inline" />
                <span>Nuestra Historia</span>
              </span>
              <span>&bull;</span>
              <span dangerouslySetInnerHTML={{ __html: chapter }} />
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1C1A17] font-normal leading-[1.12] tracking-tight">
                {hasMemory ? (
                  title
                ) : (
                  <>
                    Mili <span className="text-[#92543E] font-serif italic">&amp;</span> Lolo
                  </>
                )}
              </h1>
              {!hasMemory && (
                <p className="font-serif italic text-xl sm:text-2xl text-[#827B73]">
                  Un cuaderno privado para guardar lo que sentimos.
                </p>
              )}
            </div>

            <blockquote className="relative border-l-2 border-[#92543E]/40 pl-6 py-2 my-4 bg-[#F9F6F0]/60 rounded-r-2xl">
              <p className="font-serif italic text-lg sm:text-xl text-[#3A3530] leading-relaxed">
                {quote}
              </p>
              <footer className="mt-3 text-xs tracking-wider uppercase text-[#827B73] font-medium flex items-center space-x-2">
                <span>— {hasMemory ? "Fragmento del Archivo" : "Lema de Nuestro Diario"}</span>
              </footer>
            </blockquote>

            <div className="pt-1 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-[#6E6862]">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#92543E]" />
                <span className="tracking-wide">{location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-[#92543E]" />
                <span className="tracking-wide" dangerouslySetInnerHTML={{ __html: dateStr }} />
              </div>
            </div>

            {/* Botones de acción principales */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              {hasMemory ? (
                <Link
                  href={`/recuerdos/${featuredMemory!.id}`}
                  className="group inline-flex items-center space-x-2 px-6 py-3.5 rounded-full bg-[#1C1A17] text-[#FAF8F5] text-xs uppercase tracking-widest font-medium hover:bg-[#92543E] transition-all duration-300 shadow-sm"
                >
                  <span>Ver Recuerdo Completo</span>
                  <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
                </Link>
              ) : (
                <Link
                  href="/recuerdos/nuevo"
                  className="group inline-flex items-center space-x-2 px-6 py-3.5 rounded-full bg-[#1C1A17] text-[#FAF8F5] text-xs uppercase tracking-widest font-medium hover:bg-[#92543E] transition-all duration-300 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Primer Recuerdo</span>
                </Link>
              )}

              <Link
                href="/cartas/nueva"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-full border border-[#E6DFD3] bg-[#FAF8F5] text-[#4A453F] text-xs uppercase tracking-widest font-medium hover:border-[#92543E] hover:text-[#92543E] transition-all duration-300 shadow-xs"
              >
                <Feather className="w-3.5 h-3.5 text-[#92543E]" />
                <span>Escribir Carta</span>
              </Link>
            </div>
          </div>

          {/* Columna de Fotografía Protagonista (5 cols en lg) */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              <div className="relative p-4 sm:p-5 bg-white border border-[#E6DFD3] rounded-2xl photo-shadow transition-transform duration-500 hover:-translate-y-1 washi-tape-top">
                
                <div className="flex items-center justify-between pb-3 text-[10px] tracking-widest uppercase text-[#9E978F] font-mono border-b border-[#F0EBE2] mb-3">
                  <span className="flex items-center space-x-1.5">
                    <Sparkles className="w-3 h-3 text-[#92543E]" />
                    <span>COLECCIÓN ÍNTIMA</span>
                  </span>
                  <span className="text-[#92543E] font-medium" dangerouslySetInnerHTML={{ __html: dateStr }} />
                </div>

                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-[#F5EFE6] flex items-center justify-center">
                  {coverUrl ? (
                    <>
                      <Image
                        src={coverUrl}
                        alt={title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] tracking-wider uppercase bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded">
                          Fotografía Destacada
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-[#F4EDE7] flex items-center justify-center text-[#92543E] shadow-inner">
                        <Camera className="w-8 h-8" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-serif text-xl text-[#1C1A17]">
                          Espacio para nuestra foto
                        </h4>
                        <p className="font-serif italic text-xs text-[#827B73] leading-relaxed max-w-xs mx-auto">
                          Una imagen que nos recuerde dónde estábamos, qué sentíamos y por qué sonreíamos.
                        </p>
                      </div>
                      <Link
                        href="/recuerdos/nuevo"
                        className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#E6DFD3] text-[11px] uppercase tracking-wider text-[#92543E] hover:border-[#92543E] hover:bg-[#F4EDE7] font-medium transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Subir fotografía</span>
                      </Link>
                    </div>
                  )}
                </div>

                <div className="pt-3.5 flex items-center justify-between text-xs text-[#6E6862]">
                  <p className="font-serif italic sm:text-sm line-clamp-1" dangerouslySetInnerHTML={{ __html: coverCaption }} />
                  <Heart className="w-3.5 h-3.5 text-[#92543E] fill-[#92543E]/20 shrink-0 ml-2" />
                </div>
              </div>

              {/* Sello de lacre artesanal en la esquina del portarretratos */}
              <div className="absolute -bottom-5 -left-5 z-20">
                <WaxSeal size="md" showHeart={true} />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
