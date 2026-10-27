import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryNav } from "@/components/home/CategoryNav";
import { QuoteInterlude } from "@/components/home/QuoteInterlude";
import { RecentMoments, RealMomentItem } from "@/components/home/RecentMoments";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const currentUser = await requireCurrentUser();

  const [featuredMemory, memoryCount, diaryCount, letterCount, recentMemories, recentDiaries, recentLetters] =
    await Promise.all([
      prisma.memory.findFirst({
        where: { isFeatured: true },
        orderBy: { date: "desc" },
      }).then(async (feat) => {
        if (feat) return feat;
        return prisma.memory.findFirst({ orderBy: { date: "desc" } });
      }),
      prisma.memory.count(),
      prisma.diaryEntry.count(),
      prisma.letter.count(),
      prisma.memory.findMany({
        include: { author: true, tags: { include: { tag: true } } },
        orderBy: { date: "desc" },
        take: 4,
      }),
      prisma.diaryEntry.findMany({
        include: { author: true },
        orderBy: { date: "desc" },
        take: 2,
      }),
      prisma.letter.findMany({
        include: { sender: true, recipient: true },
        orderBy: { date: "desc" },
        take: 2,
      }),
    ]);

  const moments: RealMomentItem[] = [
    ...recentMemories.map((m) => ({
      id: m.id,
      type: "recuerdo" as const,
      title: m.title,
      subtitle: m.subtitle,
      excerpt: m.description,
      date: m.date,
      location: m.location,
      author: m.author.displayName,
      imageUrl: m.coverUrl,
      imageCaption: m.coverCaption,
      tags: m.tags.map((t) => t.tag.name),
      href: `/recuerdos/${m.id}`,
    })),
    ...recentDiaries.map((d) => ({
      id: d.id,
      type: "diario" as const,
      title: d.title,
      subtitle: d.mood,
      excerpt: d.content,
      date: d.date,
      location: d.location,
      author: d.author.displayName,
      href: `/diario/${d.id}`,
    })),
    ...recentLetters.map((l) => ({
      id: l.id,
      type: "carta" as const,
      title: l.title,
      subtitle: `Para ${l.recipient.displayName}`,
      excerpt: l.content,
      date: l.date,
      location: l.location,
      author: l.sender.displayName,
      href: `/cartas/${l.id}`,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-[#1C1A17] paper-texture">
      <Header currentUser={currentUser} />

      <main className="flex-1">
        {/* Sección Hero conectada a la base de datos real */}
        <HeroSection featuredMemory={featuredMemory} />

        {/* Las Tres Puertas del Archivo con conteos reales de PostgreSQL */}
        <CategoryNav
          memoryCount={memoryCount}
          diaryCount={diaryCount}
          letterCount={letterCount}
        />

        {/* Interludio Cinematográfico */}
        <QuoteInterlude />

        {/* Momentos Recientes reales extraídos de la base de datos */}
        <RecentMoments moments={moments} />
      </main>

      <Footer />
    </div>
  );
}
