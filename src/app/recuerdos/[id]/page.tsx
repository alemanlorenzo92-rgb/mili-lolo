import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Camera, MapPin, Pencil, Trash2, User } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/auth";
import { deleteMemoryAction } from "@/actions/memories";
import { HeartReaction } from "@/components/romantic/HeartReaction";

interface MemoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MemoryDetailPage({ params }: MemoryDetailPageProps) {
  const currentUser = await requireCurrentUser();
  const { id } = await params;

  const memory = await prisma.memory.findUnique({
    where: { id },
    include: {
      author: true,
      media: true,
      tags: { include: { tag: true } },
    },
  });

  if (!memory) {
    notFound();
  }

  const deleteActionWithId = deleteMemoryAction.bind(null, memory.id);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-[#1C1A17] paper-texture">
      <Header currentUser={currentUser} />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/recuerdos"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#827B73] hover:text-[#92543E] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a todos los recuerdos</span>
            </Link>

            <div className="flex items-center space-x-3">
              <Link
                href={`/recuerdos/${memory.id}/editar`}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#E6DFD3] bg-[#FAF8F5] text-[#1C1A17] hover:border-[#92543E] hover:text-[#92543E] text-xs transition-colors"
                title="Editar este recuerdo"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Editar recuerdo</span>
              </Link>

              <form action={deleteActionWithId}>
                <button
                  type="submit"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#D97757]/40 text-[#92543E] hover:bg-[#F4EDE7] text-xs transition-colors"
                  title="Eliminar este recuerdo permanentemente"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar recuerdo</span>
                </button>
              </form>
            </div>
          </div>

          <article className="space-y-10">
            {/* Cabecera del recuerdo */}
            <header className="space-y-4">
              <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#92543E] font-medium">
                <Camera className="w-3.5 h-3.5" />
                <span>{memory.chapter || "Recuerdo Fotográfico"}</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl text-[#1C1A17] font-normal leading-tight">
                {memory.title}
              </h1>

              {memory.subtitle && (
                <p className="text-sm font-mono text-[#827B73] uppercase tracking-wider">
                  {memory.subtitle}
                </p>
              )}

              {/* Metadatos */}
              <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#6E6862] border-y border-[#E6DFD3] py-4">
                <span className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#9E978F]" />
                  <span>
                    {new Date(memory.date).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </span>

                {memory.location && (
                  <span className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#9E978F]" />
                    <span>{memory.location}</span>
                  </span>
                )}

                <span className="flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-[#9E978F]" />
                  <span>Guardado por {memory.author.displayName}</span>
                </span>

                <div className="ml-auto">
                  <HeartReaction label="Guardar este instante en el corazón" />
                </div>
              </div>
            </header>

            {/* Fotografía o video principal */}
            {memory.coverUrl && (
              <div className="p-3 sm:p-5 bg-white rounded-2xl border border-[#E6DFD3] photo-shadow space-y-3 washi-tape-top">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#EFE9DF]">
                  {memory.media.some((m) => m.resourceType === "video") ||
                  /\/video\/upload\/|\.mp4(\?|$)/i.test(memory.coverUrl) ? (
                    <video
                      src={memory.coverUrl}
                      controls
                      playsInline
                      preload="metadata"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Image
                      src={memory.coverUrl}
                      alt={memory.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 896px"
                      className="object-cover"
                    />
                  )}
                </div>
                {memory.coverCaption && (
                  <p className="font-serif italic text-xs sm:text-sm text-[#6E6862] px-2 text-center sm:text-left">
                    {memory.coverCaption}
                  </p>
                )}
              </div>
            )}

            {/* Contenido / Historia */}
            <div className="prose prose-stone max-w-none">
              <p className="font-serif text-lg sm:text-xl text-[#3B342E] leading-relaxed whitespace-pre-line">
                {memory.description}
              </p>
            </div>

            {/* Etiquetas */}
            {memory.tags.length > 0 && (
              <div className="pt-6 border-t border-[#E6DFD3] flex flex-wrap gap-2">
                {memory.tags.map(({ tag }) => (
                  <span
                    key={tag.id}
                    className="text-xs uppercase tracking-wider px-3 py-1 rounded-full border border-[#E6DFD3] bg-[#F4EFE6] text-[#6E6862]"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
          </article>

        </div>
      </main>

      <Footer />
    </div>
  );
}
