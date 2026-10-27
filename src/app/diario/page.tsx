import Link from "next/link";
import { ArrowLeft, BookOpen, Calendar, Clock, Heart, Plus } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/auth";

export default async function DiarioPage() {
  const currentUser = await requireCurrentUser();

  const entries = await prisma.diaryEntry.findMany({
    include: { author: true },
    orderBy: { date: "desc" },
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-[#1C1A17] paper-texture">
      <Header currentUser={currentUser} />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#827B73] hover:text-[#92543E] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la portada</span>
            </Link>

            <Link
              href="/diario/nuevo"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#1C1A17] hover:bg-[#92543E] text-[#FAF8F5] text-xs uppercase tracking-wider font-medium transition-all shadow-sm hover:scale-[1.02]"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Escribir en el Diario</span>
            </Link>
          </div>

          <div className="border-b border-[#E6DFD3] pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#92543E] font-medium mb-3">
                <Heart className="w-3.5 h-3.5 fill-[#92543E] text-[#92543E] animate-heart-pulse" />
                <span>Capítulo II &bull; Cuaderno Cotidiano</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl text-[#1C1A17] font-normal">
                Diario Íntimo
              </h1>
              <p className="mt-4 text-sm sm:text-base text-[#6E6862] font-serif italic max-w-xl">
                Crónicas y anotaciones breves de los días comunes. Donde guardamos
                aquello que no queremos que se diluya en la memoria.
              </p>
            </div>

            <div className="text-xs text-[#827B73] font-mono">
              {entries.length} {entries.length === 1 ? "anotación registrada" : "anotaciones registradas"}
            </div>
          </div>

          {/* Estado vacío si no hay entradas */}
          {entries.length === 0 ? (
            <div className="p-12 sm:p-16 rounded-3xl border border-[#E6DFD3] bg-white text-center max-w-xl mx-auto space-y-6 photo-shadow">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#EDF0E6] flex items-center justify-center text-[#5F634F]">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl text-[#1C1A17]">
                El diario aún tiene sus páginas en blanco
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6862] font-serif italic leading-relaxed">
                Este espacio está reservado para los pensamientos compartidos, las mañanas lentas de café y las pequeñas cosas de todos los días.
              </p>
              <div className="pt-2">
                <Link
                  href="/diario/nuevo"
                  className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-[#1C1A17] hover:bg-[#92543E] text-[#FAF8F5] text-xs uppercase tracking-widest font-medium transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Escribir la primera anotación</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {entries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/diario/${entry.id}`}
                  className="group block p-7 sm:p-9 rounded-2xl border border-[#E6DFD3] bg-[#FAF8F5] hover:bg-white hover:border-[#92543E]/60 photo-shadow transition-all duration-300 space-y-4 hover:-translate-y-1 border-l-4 border-l-[#5F634F]/40 hover:border-l-[#5F634F]"
                >
                  <div className="flex items-center justify-between text-xs text-[#827B73] pb-3 border-b border-[#F0EBE2]">
                    <span className="font-medium text-[#1C1A17]">Escrito por {entry.author.displayName}</span>
                    <div className="flex items-center space-x-2">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-[#9E978F]" />
                        <span>
                          {new Date(entry.date).toLocaleDateString("es-AR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </span>
                    </div>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1A17] group-hover:text-[#92543E] transition-colors leading-snug">
                    {entry.title}
                  </h2>

                  <p className="font-serif italic text-sm sm:text-base text-[#4A453F] leading-relaxed line-clamp-3">
                    «{entry.content}»
                  </p>

                  <div className="pt-3 border-t border-[#F0EBE2] flex items-center justify-between text-xs text-[#827B73]">
                    <span>{entry.location || "En casa"}</span>
                    {entry.readingTime && (
                      <span className="flex items-center space-x-1 font-mono text-[11px] text-[#9E978F]">
                        <Clock className="w-3 h-3" />
                        <span>{entry.readingTime}</span>
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
