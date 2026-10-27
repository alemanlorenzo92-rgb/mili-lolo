import Link from "next/link";
import { ArrowUpRight, BookOpen, CalendarDays, Camera, Feather, Heart } from "lucide-react";

interface CategoryNavProps {
  memoryCount: number;
  diaryCount: number;
  letterCount: number;
}

export function CategoryNav({ memoryCount, diaryCount, letterCount }: CategoryNavProps) {
  const totalMoments = memoryCount + diaryCount + letterCount;

  const categories = [
    {
      key: "recuerdos",
      chapter: "Capítulo I",
      title: "Recuerdos",
      subtitle: "Fotografías & Instantes",
      href: "/recuerdos",
      description:
        "Nuestra bitácora visual: paisajes compartidos, senderos descubiertos y retratos de nuestros viajes y días.",
      countBadge: `${memoryCount} ${memoryCount === 1 ? "recuerdo" : "recuerdos"}`,
      icon: Camera,
      tagColor: "bg-[#EAE4D9] text-[#4A453F]",
    },
    {
      key: "diario",
      chapter: "Capítulo II",
      title: "Diario",
      subtitle: "Anotaciones & Pensamientos",
      href: "/diario",
      description:
        "El registro íntimo de los días comunes: mañanas lentas de domingo, charlas de café y vivencias cotidianas.",
      countBadge: `${diaryCount} ${diaryCount === 1 ? "entrada" : "entradas"}`,
      icon: BookOpen,
      tagColor: "bg-[#EDF0E6] text-[#5F634F]",
    },
    {
      key: "cartas",
      chapter: "Capítulo III",
      title: "Cartas",
      subtitle: "Correspondencia Privada",
      href: "/cartas",
      description:
        "Palabras escritas sin prisa, con sello de cera, guardadas para leerse una y otra vez en la intimidad.",
      countBadge: `${letterCount} ${letterCount === 1 ? "carta" : "cartas"}`,
      icon: Feather,
      tagColor: "bg-[#F4EDE7] text-[#92543E]",
    },
    {
      key: "timeline",
      chapter: "Cronología",
      title: "Línea Temporal",
      subtitle: "Nuestra Historia Unida",
      href: "/timeline",
      description:
        "El hilo conductor que une recuerdos, notas de diario y cartas en una sola secuencia temporal viva.",
      countBadge: `${totalMoments} ${totalMoments === 1 ? "momento" : "momentos"}`,
      icon: CalendarDays,
      tagColor: "bg-[#F7EFE8] text-[#8B3A2B]",
    },
  ];

  return (
    <section className="py-16 sm:py-20 border-y border-[#E6DFD3] bg-[#F4EFE6]/35 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#92543E] font-medium mb-2 flex items-center space-x-1.5">
              <Heart className="w-3 h-3 fill-[#92543E] text-[#92543E]" />
              <span>Índice del Diario</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1A17] font-normal">
              Las Cuatro Puertas del Archivo
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#827B73] max-w-sm font-serif italic">
            Imágenes que guardan la luz, pensamientos diarios, cartas selladas y
            el recorrido cronológico de todo lo vivido juntos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((section) => {
            const Icon = section.icon;

            return (
              <Link
                key={section.key}
                href={section.href}
                className="group relative flex flex-col justify-between p-7 rounded-2xl border border-[#E6DFD3] bg-[#FAF8F5] hover:bg-white hover:border-[#92543E]/60 transition-all duration-300 photo-shadow hover:-translate-y-1.5"
              >
                <div>
                  <div className="flex items-center justify-between pb-3.5 border-b border-[#F0EBE2] text-xs text-[#827B73]">
                    <span className="font-serif italic text-sm text-[#92543E]">
                      {section.chapter}
                    </span>
                    <span className={`text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full ${section.tagColor}`}>
                      {section.countBadge}
                    </span>
                  </div>

                  <div className="my-5">
                    <div className="w-10 h-10 rounded-full bg-[#F4EFE6] flex items-center justify-center text-[#92543E] mb-3.5 group-hover:bg-[#92543E] group-hover:text-white transition-all duration-300 group-hover:scale-105">
                      <Icon className="w-4.5 h-4.5" />
                    </div>

                    <h3 className="font-serif text-2xl text-[#1C1A17] group-hover:text-[#92543E] transition-colors">
                      {section.title}
                    </h3>
                    <div className="text-[11px] uppercase tracking-wider text-[#9E978F] font-medium mt-1">
                      {section.subtitle}
                    </div>

                    <p className="mt-3 text-xs text-[#6E6862] leading-relaxed font-sans line-clamp-3">
                      {section.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F0EBE2] flex items-center justify-between text-xs text-[#827B73] group-hover:text-[#92543E] transition-colors">
                  <span className="font-medium tracking-wider text-[11px] uppercase">
                    Explorar
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
