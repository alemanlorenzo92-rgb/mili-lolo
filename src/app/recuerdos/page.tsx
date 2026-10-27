import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Camera, Heart, MapPin, Plus } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/auth";

interface RecuerdosPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function RecuerdosPage({ searchParams }: RecuerdosPageProps) {
  const currentUser = await requireCurrentUser();
  const { tag } = await searchParams;

  const memories = await prisma.memory.findMany({
    where: tag
      ? {
          tags: {
            some: {
              tag: {
                name: { equals: tag.toLowerCase() },
              },
            },
          },
        }
      : undefined,
    include: {
      author: true,
      tags: { include: { tag: true } },
    },
    orderBy: { date: "desc" },
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-[#1C1A17] paper-texture">
      <Header currentUser={currentUser} />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#827B73] hover:text-[#92543E] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la portada</span>
            </Link>

            <Link
              href="/recuerdos/nuevo"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#1C1A17] hover:bg-[#92543E] text-[#FAF8F5] text-xs uppercase tracking-wider font-medium transition-all shadow-sm hover:scale-[1.02]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Recuerdo</span>
            </Link>
          </div>

          <div className="border-b border-[#E6DFD3] pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#92543E] font-medium mb-3">
                <Heart className="w-3.5 h-3.5 fill-[#92543E] text-[#92543E] animate-heart-pulse" />
                <span>Capítulo I &bull; Archivo Visual</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl text-[#1C1A17] font-normal">
                Recuerdos &amp; Fotografías
              </h1>
              <p className="mt-4 text-sm sm:text-base text-[#6E6862] font-serif italic max-w-2xl">
                Nuestra colección fotográfica viva. Imágenes seleccionadas sin prisa
                que documentan viajes, mañanas lentas y pequeños hallazgos.
              </p>
            </div>

            <div className="text-xs text-[#827B73] font-mono">
              {memories.length} {memories.length === 1 ? "recuerdo guardado" : "recuerdos guardados"}
              {tag && ` (filtrado por #${tag})`}
            </div>
          </div>

          {/* Estado vacío si no hay recuerdos */}
          {memories.length === 0 ? (
            <div className="p-12 sm:p-16 rounded-3xl border border-[#E6DFD3] bg-white text-center max-w-2xl mx-auto space-y-6 photo-shadow">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#F4EFE6] flex items-center justify-center text-[#92543E]">
                <Camera className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl text-[#1C1A17]">
                {tag ? `No hay recuerdos con la etiqueta #${tag}` : "El archivo fotográfico está esperando su primer recuerdo"}
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6862] font-serif italic leading-relaxed max-w-md mx-auto">
                {tag
                  ? "Probá limpiando el filtro de etiquetas para ver todas las fotografías."
                  : "Cada viaje, cada tarde de café y cada mirada importante merecen un espacio reservado en este diario íntimo."}
              </p>
              <div className="pt-2">
                {tag ? (
                  <Link
                    href="/recuerdos"
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl border border-[#E6DFD3] text-xs uppercase tracking-wider font-medium text-[#1C1A17] hover:border-[#92543E]"
                  >
                    <span>Ver todos los recuerdos</span>
                  </Link>
                ) : (
                  <Link
                    href="/recuerdos/nuevo"
                    className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-[#1C1A17] hover:bg-[#92543E] text-[#FAF8F5] text-xs uppercase tracking-widest font-medium transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Guardar el primer recuerdo</span>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            /* Grilla editorial asimétrica de recuerdos */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {memories.map((moment, idx) => {
                const isHighlight = idx === 0 && memories.length > 2;
                const cardSpan = isHighlight ? "md:col-span-2 lg:col-span-2" : "col-span-1";

                return (
                  <Link
                    key={moment.id}
                    href={`/recuerdos/${moment.id}`}
                    className={`group flex flex-col rounded-2xl border border-[#E6DFD3] bg-[#FAF8F5] overflow-hidden photo-shadow hover:-translate-y-1.5 hover:border-[#92543E]/60 transition-all duration-300 ${cardSpan} ${
                      isHighlight ? "washi-tape-top" : ""
                    }`}
                  >
                    {moment.coverUrl ? (
                      <div
                        className={`relative w-full overflow-hidden bg-[#EFE9DF] ${
                          isHighlight ? "aspect-[16/9] min-h-[300px]" : "aspect-[16/10]"
                        }`}
                      >
                        {/\/video\/upload\/|\.mp4(\?|$)/i.test(moment.coverUrl) ? (
                          <video
                            src={moment.coverUrl}
                            muted
                            playsInline
                            preload="metadata"
                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <Image
                            src={moment.coverUrl}
                            alt={moment.title}
                            fill
                            sizes={
                              isHighlight
                                ? "(max-width: 1024px) 100vw, 66vw"
                                : "(max-width: 768px) 100vw, 33vw"
                            }
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                        {moment.coverCaption && (
                          <div className="absolute bottom-2.5 left-3 right-3">
                            <p className="font-serif italic text-xs text-white/90 drop-shadow line-clamp-1">
                              {moment.coverCaption}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-[16/10] w-full bg-[#EAE4D9]/60 flex items-center justify-center text-[#9E978F]">
                        <Camera className="w-8 h-8 opacity-40" />
                      </div>
                    )}

                    <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-xs text-[#827B73] mb-2.5">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5 text-[#9E978F]" />
                            <span>
                              {new Date(moment.date).toLocaleDateString("es-AR", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </span>
                          {moment.location && (
                            <span className="flex items-center space-x-1 line-clamp-1">
                              <MapPin className="w-3.5 h-3.5 text-[#9E978F]" />
                              <span>{moment.location}</span>
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif text-2xl sm:text-3xl text-[#1C1A17] group-hover:text-[#92543E] transition-colors leading-snug">
                          {moment.title}
                        </h3>

                        <p className="mt-2.5 text-xs sm:text-sm text-[#4A453F] line-clamp-3 leading-relaxed">
                          {moment.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#F0EBE2] flex items-center justify-between text-xs text-[#827B73]">
                        <span>Guardado por {moment.author.displayName}</span>
                        <span className="font-serif italic text-[#92543E] group-hover:underline flex items-center space-x-1">
                          <span>Ver recuerdo</span>
                          <span>&rarr;</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
