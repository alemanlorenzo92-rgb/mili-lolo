import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Camera } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/auth";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { MemoryForm } from "@/components/forms/MemoryForm";

interface EditarRecuerdoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarRecuerdoPage({
  params,
}: EditarRecuerdoPageProps) {
  const currentUser = await requireCurrentUser();
  const { id } = await params;

  const memory = await prisma.memory.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
    },
  });

  if (!memory) {
    notFound();
  }

  const isCloudinaryReady = isCloudinaryConfigured();

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-[#1C1A17] paper-texture">
      <Header currentUser={currentUser} />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <div className="mb-8">
            <Link
              href={`/recuerdos/${memory.id}`}
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#827B73] hover:text-[#92543E] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al recuerdo</span>
            </Link>
          </div>

          <div className="border-b border-[#E6DFD3] pb-6 mb-10">
            <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#92543E] font-medium mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Archivo Visual</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1A17] font-normal">
              Editar Recuerdo
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#6E6862] font-serif italic">
              Actualizá los detalles, la crónica o la portada conservando su lugar original en el archivo.
            </p>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E6DFD3] photo-shadow">
            <MemoryForm
              isCloudinaryReady={isCloudinaryReady}
              initialData={{
                id: memory.id,
                title: memory.title,
                subtitle: memory.subtitle,
                chapter: memory.chapter,
                description: memory.description,
                date: memory.date,
                location: memory.location,
                isFeatured: memory.isFeatured,
                coverUrl: memory.coverUrl,
                coverCaption: memory.coverCaption,
                tags: memory.tags.map(({ tag }) => tag.name),
              }}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
