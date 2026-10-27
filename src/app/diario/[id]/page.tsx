import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Calendar, Clock, Heart, MapPin, Pencil, Smile, Trash2, User } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/auth";
import { deleteDiaryEntryAction } from "@/actions/diary";
import { HeartReaction } from "@/components/romantic/HeartReaction";

interface DiaryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DiaryDetailPage({ params }: DiaryDetailPageProps) {
  const currentUser = await requireCurrentUser();
  const { id } = await params;

  const entry = await prisma.diaryEntry.findUnique({
    where: { id },
    include: { author: true },
  });

  if (!entry) {
    notFound();
  }

  const deleteActionWithId = deleteDiaryEntryAction.bind(null, entry.id);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-[#1C1A17] paper-texture">
      <Header currentUser={currentUser} />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/diario"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#827B73] hover:text-[#92543E] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a todas las entradas</span>
            </Link>

            <div className="flex items-center space-x-3">
              <HeartReaction label="Guardar anotación en el corazón" />

              <Link
                href={`/diario/${entry.id}/editar`}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#E6DFD3] bg-[#FAF8F5] text-[#1C1A17] hover:border-[#92543E] hover:text-[#92543E] text-xs transition-colors"
                title="Editar esta anotación del diario"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Editar</span>
              </Link>

              <form action={deleteActionWithId}>
                <button
                  type="submit"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#D97757]/40 text-[#92543E] hover:bg-[#F4EDE7] text-xs transition-colors"
                  title="Eliminar esta entrada permanentemente"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar</span>
                </button>
              </form>
            </div>
          </div>

          {/* Cuaderno personal con encuadernación */}
          <article className="relative bg-white p-8 sm:p-14 rounded-3xl border border-[#E6DFD3] photo-shadow space-y-8 animate-fade-in-up border-l-4 border-l-[#92543E]">
            <header className="space-y-4 border-b border-[#F0EBE2] pb-6">
              <div className="flex items-center justify-between text-xs text-[#827B73]">
                <div className="inline-flex items-center space-x-2 uppercase tracking-[0.2em] text-[#92543E] font-medium">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Capítulo II &bull; Diario Íntimo</span>
                </div>
                {entry.readingTime && (
                  <span className="flex items-center space-x-1 font-mono text-[11px] text-[#9E978F]">
                    <Clock className="w-3 h-3" />
                    <span>{entry.readingTime}</span>
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1A17] font-normal leading-snug">
                {entry.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#6E6862] pt-2">
                <span className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#9E978F]" />
                  <span>
                    {new Date(entry.date).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </span>

                {entry.location && (
                  <span className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#9E978F]" />
                    <span>{entry.location}</span>
                  </span>
                )}

                {entry.mood && (
                  <span className="flex items-center space-x-1.5 italic text-[#92543E]">
                    <Smile className="w-3.5 h-3.5" />
                    <span>Estado: {entry.mood}</span>
                  </span>
                )}

                <span className="flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-[#9E978F]" />
                  <span>Escrito por {entry.author.displayName}</span>
                </span>
              </div>
            </header>

            <div className="prose prose-stone max-w-none pt-2 pb-6">
              <p className="font-serif text-lg sm:text-xl text-[#2D2823] leading-relaxed sm:leading-loose whitespace-pre-line tracking-wide">
                {entry.content}
              </p>
            </div>

            <footer className="pt-6 border-t border-[#F0EBE2] flex items-center justify-between text-xs text-[#827B73] font-serif italic">
              <div className="flex items-center space-x-1.5">
                <Heart className="w-3 h-3 fill-[#92543E] text-[#92543E]" />
                <span>Página de nuestro diario compartido</span>
              </div>
              <span className="text-[#92543E] font-medium not-italic font-sans text-[11px] uppercase tracking-wider">
                Mili &amp; Lolo
              </span>
            </footer>
          </article>

        </div>
      </main>

      <Footer />
    </div>
  );
}
