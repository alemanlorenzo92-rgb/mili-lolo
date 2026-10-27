import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Heart, MapPin, Trash2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/auth";
import { deleteLetterAction, markLetterAsReadAction } from "@/actions/letters";
import { WaxSeal } from "@/components/romantic/WaxSeal";
import { HeartReaction } from "@/components/romantic/HeartReaction";

interface LetterDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LetterDetailPage({ params }: LetterDetailPageProps) {
  const currentUser = await requireCurrentUser();
  const { id } = await params;

  const letter = await prisma.letter.findUnique({
    where: { id },
    include: {
      sender: true,
      recipient: true,
    },
  });

  if (!letter) {
    notFound();
  }

  // Si el usuario actual es el destinatario y la carta no estaba leída, marcarla
  if (currentUser && letter.recipientId === currentUser.id && !letter.isRead) {
    await markLetterAsReadAction(letter.id);
  }

  const deleteActionWithId = deleteLetterAction.bind(null, letter.id);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-[#1C1A17] paper-texture">
      <Header currentUser={currentUser} />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/cartas"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#827B73] hover:text-[#92543E] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a todas las cartas</span>
            </Link>

            <div className="flex items-center space-x-3">
              <HeartReaction label="Guardar esta carta con cariño" />

              <form action={deleteActionWithId}>
                <button
                  type="submit"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#D97757]/40 text-[#92543E] hover:bg-[#F4EDE7] text-xs transition-colors"
                  title="Eliminar esta carta permanentemente"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar</span>
                </button>
              </form>
            </div>
          </div>

          {/* Presentación de Carta / Pliego de Correspondencia Fina */}
          <article className="relative bg-[#FCFAF7] p-8 sm:p-14 rounded-3xl border border-[#E6DFD3] photo-shadow space-y-8 animate-fade-in-up stationery-border">
            
            {/* Sello de lacre que corona la carta */}
            <div className="absolute -top-6 right-8 sm:right-12 z-20">
              <WaxSeal size="lg" showHeart={true} />
            </div>

            {/* Membrete del sobre */}
            <header className="border-b border-[#E6DFD3] pb-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between text-xs text-[#827B73] gap-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#92543E]" />
                  <span className="font-mono uppercase tracking-wider text-[#92543E] font-medium">
                    De {letter.sender.displayName} para {letter.recipient.displayName}
                  </span>
                </div>
                <span className="italic font-serif flex items-center space-x-1 text-[#827B73]">
                  <Heart className="w-3 h-3 fill-[#92543E] text-[#92543E] inline" />
                  <span>{letter.isRead ? "Abierta y guardada" : "Leída por primera vez"}</span>
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1A17] font-normal leading-snug tracking-tight">
                {letter.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#6E6862] pt-2">
                <span className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#9E978F]" />
                  <span>
                    {new Date(letter.date).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </span>

                {letter.location && (
                  <span className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#9E978F]" />
                    <span>{letter.location}</span>
                  </span>
                )}
              </div>
            </header>

            {/* Cuerpo de la carta con tipografía literaria espaciosa */}
            <div className="prose prose-stone max-w-none pt-4 pb-8">
              <p className="font-serif italic text-lg sm:text-2xl text-[#2B231D] leading-relaxed sm:leading-loose whitespace-pre-line tracking-wide">
                {letter.content}
              </p>
            </div>

            {/* Firma al pie */}
            <footer className="pt-8 border-t border-[#E6DFD3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="font-serif italic text-sm text-[#827B73] flex items-center space-x-1.5">
                <Heart className="w-3.5 h-3.5 text-[#92543E] fill-[#92543E]" />
                <span>Correspondencia privada &bull; Archivo de Mili &amp; Lolo</span>
              </div>
              <div className="font-serif italic text-2xl text-[#92543E] font-medium text-right">
                Con todo mi amor, {letter.sender.displayName}
              </div>
            </footer>
          </article>

        </div>
      </main>

      <Footer />
    </div>
  );
}
