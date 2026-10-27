import Link from "next/link";
import { ArrowLeft, Calendar, Feather, Heart, Plus } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/auth";
import { WaxSeal } from "@/components/romantic/WaxSeal";

export default async function CartasPage() {
  const currentUser = await requireCurrentUser();

  const letters = await prisma.letter.findMany({
    include: {
      sender: true,
      recipient: true,
    },
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
              href="/cartas/nueva"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#1C1A17] hover:bg-[#92543E] text-[#FAF8F5] text-xs uppercase tracking-wider font-medium transition-all shadow-sm hover:scale-[1.02]"
            >
              <Feather className="w-3.5 h-3.5" />
              <span>Escribir Carta</span>
            </Link>
          </div>

          <div className="border-b border-[#E6DFD3] pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#92543E] font-medium mb-3">
                <Heart className="w-3.5 h-3.5 fill-[#92543E] text-[#92543E] animate-heart-pulse" />
                <span>Capítulo III &bull; Correspondencia Privada</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl text-[#1C1A17] font-normal">
                Cartas &amp; Notas Selladas
              </h1>
              <p className="mt-4 text-sm sm:text-base text-[#6E6862] font-serif italic max-w-xl">
                Palabras escritas a mano alzada, guardadas exclusivamente para leerse
                una y otra vez con el corazón en paz.
              </p>
            </div>

            <div className="text-xs text-[#827B73] font-mono">
              {letters.length} {letters.length === 1 ? "carta sellada" : "cartas selladas"}
            </div>
          </div>

          {/* Estado vacío si no hay cartas */}
          {letters.length === 0 ? (
            <div className="p-12 sm:p-16 rounded-3xl border border-[#E6DFD3] bg-white text-center max-w-xl mx-auto space-y-6 photo-shadow">
              <div className="flex justify-center">
                <WaxSeal size="lg" showHeart={true} />
              </div>
              <h3 className="font-serif text-2xl text-[#1C1A17]">
                El buzón íntimo está esperando su primera carta
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6862] font-serif italic leading-relaxed">
                Dejale una carta a tu pareja para que la encuentre al entrar. Una promesa, un recuerdo del día o simplemente un agradecimiento sincero sellado con cariño.
              </p>
              <div className="pt-2">
                <Link
                  href="/cartas/nueva"
                  className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-[#1C1A17] hover:bg-[#92543E] text-[#FAF8F5] text-xs uppercase tracking-widest font-medium transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Escribir la primera carta</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {letters.map((letter) => {
                const isForMe = currentUser && letter.recipientId === currentUser.id;
                const isUnread = !letter.isRead && isForMe;

                return (
                  <Link
                    key={letter.id}
                    href={`/cartas/${letter.id}`}
                    className="group block relative p-7 sm:p-9 rounded-2xl border border-[#E6DFD3] bg-[#FAF8F5] hover:bg-white hover:border-[#92543E]/60 photo-shadow transition-all duration-300 space-y-4 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between text-xs text-[#827B73] pb-3.5 border-b border-[#F0EBE2]">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#92543E]" />
                        <span className="font-mono uppercase tracking-wider text-[#92543E] font-medium">
                          De {letter.sender.displayName} para {letter.recipient.displayName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        {isUnread && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#92543E] text-white text-[10px] uppercase tracking-wider font-semibold animate-pulse">
                            Sobre sin abrir
                          </span>
                        )}
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-[#9E978F]" />
                          <span>
                            {new Date(letter.date).toLocaleDateString("es-AR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1A17] group-hover:text-[#92543E] transition-colors leading-snug">
                          {letter.title}
                        </h2>

                        <p className="font-serif italic text-sm sm:text-base text-[#4A453F] line-clamp-2 leading-relaxed">
                          «{letter.content}»
                        </p>
                      </div>

                      <div className="shrink-0 pt-1">
                        <WaxSeal size="sm" showHeart={true} />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#F0EBE2] flex items-center justify-between text-xs text-[#827B73]">
                      <span>{letter.location || "En el cuaderno íntimo"}</span>
                      <span className="font-serif italic text-[#92543E] group-hover:underline flex items-center space-x-1">
                        <span>Abrir y leer sobre</span>
                        <span>&rarr;</span>
                      </span>
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
