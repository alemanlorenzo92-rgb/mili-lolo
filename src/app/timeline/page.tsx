import Link from "next/link";
import { ArrowLeft, BookOpen, Calendar, CalendarDays, Camera, Feather, Heart, MapPin } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/auth";

interface TimelineEvent {
  id: string;
  type: "recuerdo" | "diario" | "carta";
  title: string;
  excerpt: string;
  date: Date;
  location?: string | null;
  author: string;
  href: string;
}

export default async function TimelinePage() {
  const currentUser = await requireCurrentUser();

  const [memories, diaryEntries, letters] = await Promise.all([
    prisma.memory.findMany({
      include: { author: true },
    }),
    prisma.diaryEntry.findMany({
      include: { author: true },
    }),
    prisma.letter.findMany({
      include: { sender: true, recipient: true },
    }),
  ]);

  const timelineItems: TimelineEvent[] = [
    ...memories.map((m) => ({
      id: `mem-${m.id}`,
      type: "recuerdo" as const,
      title: m.title,
      excerpt: m.description,
      date: new Date(m.date),
      location: m.location,
      author: m.author.displayName,
      href: `/recuerdos/${m.id}`,
    })),
    ...diaryEntries.map((d) => ({
      id: `dia-${d.id}`,
      type: "diario" as const,
      title: d.title,
      excerpt: d.content,
      date: new Date(d.date),
      location: d.location,
      author: d.author.displayName,
      href: `/diario/${d.id}`,
    })),
    ...letters.map((l) => ({
      id: `let-${l.id}`,
      type: "carta" as const,
      title: l.title,
      excerpt: l.content,
      date: new Date(l.date),
      location: l.location,
      author: `${l.sender.displayName} → ${l.recipient.displayName}`,
      href: `/cartas/${l.id}`,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  // Agrupar por año para una navegación cronológica rica
  const itemsByYear = timelineItems.reduce<Record<string, TimelineEvent[]>>((acc, item) => {
    const year = item.date.getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(item);
    return acc;
  }, {});

  const years = Object.keys(itemsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-[#1C1A17] paper-texture">
      <Header currentUser={currentUser} />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#827B73] hover:text-[#92543E] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la portada</span>
            </Link>
          </div>

          <div className="border-b border-[#E6DFD3] pb-8 mb-12">
            <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#92543E] font-medium mb-3">
              <Heart className="w-3.5 h-3.5 fill-[#92543E] text-[#92543E] animate-heart-pulse" />
              <span>Nuestra Historia &bull; Cronología Viva</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#1C1A17] font-normal">
              Línea Temporal Unificada
            </h1>
            <p className="mt-4 text-sm sm:text-base text-[#6E6862] font-serif italic max-w-2xl">
              Nuestra historia uniendo recuerdos visuales, notas de diario íntimo y cartas
              en un solo recorrido cronológico continuo.
            </p>
          </div>

          {timelineItems.length === 0 ? (
            <div className="p-12 sm:p-16 rounded-3xl border border-[#E6DFD3] bg-white text-center max-w-xl mx-auto space-y-6 photo-shadow">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#F4EFE6] flex items-center justify-center text-[#92543E]">
                <CalendarDays className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl text-[#1C1A17]">
                La línea temporal comenzará con tu primer registro
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6862] font-serif italic leading-relaxed">
                A medida que añadas fotos, anotaciones y cartas, este hilo conductor ordenará automáticamente cada momento que vivan juntos.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <Link
                  href="/recuerdos/nuevo"
                  className="px-5 py-2.5 rounded-xl bg-[#1C1A17] hover:bg-[#92543E] text-white text-xs uppercase tracking-wider font-medium transition-colors"
                >
                  + Subir Recuerdo
                </Link>
                <Link
                  href="/diario/nuevo"
                  className="px-5 py-2.5 rounded-xl border border-[#E6DFD3] hover:border-[#92543E] text-[#1C1A17] text-xs uppercase tracking-wider font-medium transition-colors"
                >
                  + Escribir en Diario
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-16">
              {years.map((year) => (
                <div key={year} className="space-y-8">
                  {/* Divisor de Año */}
                  <div className="inline-flex items-center space-x-3">
                    <span className="font-serif text-3xl font-medium text-[#92543E] bg-[#F4EDE7] px-4 py-1 rounded-xl border border-[#E6DFD3]">
                      {year}
                    </span>
                    <span className="h-px w-24 bg-[#D6CEBF]" />
                  </div>

                  <div className="relative pl-7 sm:pl-9 border-l-2 border-[#D6CEBF] space-y-10 ml-4 sm:ml-6">
                    {itemsByYear[year].map((item) => {
                      const config = {
                        recuerdo: {
                          icon: Camera,
                          badge: "Recuerdo",
                          color: "bg-[#EAE4D9] text-[#4A453F]",
                        },
                        diario: {
                          icon: BookOpen,
                          badge: "Diario",
                          color: "bg-[#EDF0E6] text-[#5F634F]",
                        },
                        carta: {
                          icon: Feather,
                          badge: "Carta",
                          color: "bg-[#F4EDE7] text-[#92543E]",
                        },
                      }[item.type];

                      const Icon = config.icon;

                      return (
                        <div key={item.id} className="relative group">
                          {/* Punto exacto en el eje temporal: -left-[9px] centra un nodo de 16px en el borde de 2px */}
                          <div className="absolute -left-[37px] sm:-left-[45px] top-2 w-4 h-4 rounded-full bg-[#FAF8F5] border-2 border-[#92543E] group-hover:bg-[#92543E] group-hover:scale-125 transition-all duration-200 z-10 shadow-xs" />

                          <Link
                            href={item.href}
                            className="block p-6 sm:p-8 rounded-2xl border border-[#E6DFD3] bg-[#FAF8F5] hover:bg-white hover:border-[#92543E]/60 photo-shadow transition-all duration-300 space-y-3 hover:-translate-y-1"
                          >
                            <div className="flex items-center justify-between text-xs text-[#827B73] pb-2.5 border-b border-[#F0EBE2]">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium flex items-center space-x-1.5 ${config.color}`}>
                                <Icon className="w-3 h-3" />
                                <span>{config.badge}</span>
                              </span>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-3.5 h-3.5 text-[#9E978F]" />
                                <span className="font-medium text-[#1C1A17]">
                                  {item.date.toLocaleDateString("es-AR", {
                                    day: "numeric",
                                    month: "long",
                                  })}
                                </span>
                              </div>
                            </div>

                            <h3 className="font-serif text-2xl text-[#1C1A17] group-hover:text-[#92543E] transition-colors">
                              {item.title}
                            </h3>

                            <p className="font-serif italic text-sm text-[#4A453F] line-clamp-2 leading-relaxed">
                              «{item.excerpt}»
                            </p>

                            <div className="pt-2 flex items-center justify-between text-xs text-[#827B73]">
                              <span>{item.author}</span>
                              {item.location && (
                                <span className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3 text-[#9E978F]" />
                                  <span>{item.location}</span>
                                </span>
                              )}
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
