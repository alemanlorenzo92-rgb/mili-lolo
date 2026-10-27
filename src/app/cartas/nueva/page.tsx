import Link from "next/link";
import { ArrowLeft, Feather } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/auth";
import { LetterForm } from "@/components/forms/LetterForm";

export default async function NuevaCartaPage() {
  const currentUser = await requireCurrentUser();

  const recipients = await prisma.user.findMany({
    select: { id: true, displayName: true },
    orderBy: { displayName: "asc" },
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-[#1C1A17] paper-texture">
      <Header currentUser={currentUser} />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <div className="mb-8">
            <Link
              href="/cartas"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#827B73] hover:text-[#92543E] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a cartas</span>
            </Link>
          </div>

          <div className="border-b border-[#E6DFD3] pb-6 mb-10">
            <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#92543E] font-medium mb-2">
              <Feather className="w-3.5 h-3.5" />
              <span>Correspondencia Privada</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1A17] font-normal">
              Escribir una Carta
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#6E6862] font-serif italic">
              Palabras sin filtros ni prisas, reservadas exclusivamente para ser
              leídas por los dos.
            </p>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E6DFD3] photo-shadow">
            <LetterForm recipients={recipients} currentUserId={currentUser.id} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
