export type ContentCategory = "recuerdos" | "diario" | "cartas";

export type Author = "Mili" | "Lolo" | "Ambos";

export interface MomentItem {
  id: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  date: string;
  year: string;
  category: "recuerdo" | "diario" | "carta";
  location?: string;
  author: Author;
  imageUrl?: string;
  imageAlt?: string;
  imageCaption?: string;
  featured?: boolean;
  tags?: string[];
  readingTime?: string;
  aspectRatio?: "portrait" | "landscape" | "square";
}

export interface SectionCategory {
  key: ContentCategory;
  title: string;
  href: string;
  subtitle: string;
  description: string;
  countBadge: string;
  previewNote: string;
}

export interface HeroFeaturedStory {
  title: string;
  chapter: string;
  quote: string;
  authorQuote: string;
  location: string;
  dateRange: string;
  image: {
    url: string;
    alt: string;
    caption: string;
    date: string;
  };
}
