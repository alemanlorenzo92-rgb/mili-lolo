import { HeroFeaturedStory, MomentItem, SectionCategory } from "@/types";

export const HERO_STORY: HeroFeaturedStory = {
  chapter: "Capítulo IV",
  title: "La quietud de las horas compartidas",
  quote:
    "«Hay silencios que no reclaman ninguna explicación; sólo piden que estemos ahí, contemplando cómo cae la misma luz dorada sobre la taza de café.»",
  authorQuote: "Fragmento del diario íntimo",
  location: "San Martín de los Andes & Buenos Aires",
  dateRange: "2021 — 2026",
  image: {
    url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1800&q=80",
    alt: "Retrato íntimo y cálido de pareja a la hora dorada",
    caption: "Fotograma 35mm • Atardecer en el mirador del lago, verano",
    date: "Enero, 2025",
  },
};

export const CATEGORY_SECTIONS: SectionCategory[] = [
  {
    key: "recuerdos",
    title: "Recuerdos",
    subtitle: "Fotografías & Instantes",
    href: "/recuerdos",
    description:
      "Nuestra bitácora visual: paisajes compartidos, senderos descubiertos y retratos que guardan la temperatura exacta del momento.",
    countBadge: "48 recuerdos",
    previewNote: "Desde las montañas del sur hasta las esquinas de Buenos Aires.",
  },
  {
    key: "diario",
    title: "Diario",
    subtitle: "Anotaciones & Pensamientos",
    href: "/diario",
    description:
      "El registro cotidiano de los días comunes: mañanas lentas de domingo, charlas de sobremesa y descubrimientos en voz baja.",
    countBadge: "32 entradas",
    previewNote: "Reflexiones sinceras sobre el paso del tiempo juntos.",
  },
  {
    key: "cartas",
    title: "Cartas",
    subtitle: "Correspondencia Privada",
    href: "/cartas",
    description:
      "Palabras escritas sin prisa, guardadas con intimidad para leerse una y otra vez cuando la distancia o el recuerdo lo pidan.",
    countBadge: "14 cartas",
    previewNote: "Textos sellados con el pulso honesto de quien ama.",
  },
];

export const RECENT_MOMENTS: MomentItem[] = [
  {
    id: "demo-recuerdo-01",
    title: "La primera nevada en la cabaña de madera",
    subtitle: "Cuaderno de viajes • Rollo 35mm",
    excerpt:
      "El fuego crepitaba en la salamandra mientras afuera todo se iba cubriendo de blanco. Dijimos que nos quedaríamos despiertos para ver el amanecer helado, pero nos venció el sueño con el libro aún abierto entre las manos.",
    date: "18 de Julio, 2024",
    year: "2024",
    category: "recuerdo",
    location: "Villa La Angostura",
    author: "Ambos",
    imageUrl:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Vista pacífica del lago y bosque con bruma alpina",
    imageCaption: "Placa 04/36 • Bruma sobre el agua al caer la tarde",
    featured: true,
    tags: ["Viaje al Sur", "Invierno", "Naturaleza"],
    aspectRatio: "landscape",
  },
  {
    id: "demo-diario-01",
    title: "El café de las ocho y los domingos sin reloj",
    subtitle: "Anotación de madrugada",
    excerpt:
      "No existe mayor riqueza que un domingo sin obligaciones. Preparaste el café con la cafetera italiana, pusiste a sonar ese viejo disco de Chet Baker y la casa entera se inundó de esa calma tibia que sólo vos sabés construir.",
    date: "02 de Febrero, 2025",
    year: "2025",
    category: "diario",
    location: "Departamento, Buenos Aires",
    author: "Lolo",
    imageUrl:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Taza de café y libreta de anotaciones sobre madera cálida",
    imageCaption: "Anotaciones en tinta sepia sobre papel artesanal",
    tags: ["Hogar", "Rutina íntima", "Música"],
    readingTime: "3 min de lectura",
    aspectRatio: "portrait",
  },
  {
    id: "demo-carta-01",
    title: "Para leer cuando el viaje parezca largo",
    subtitle: "Correspondencia n.º 08",
    excerpt:
      "Te escribo esto mirando por la ventanilla del tren. Me acordé de cómo reías ayer cuando el viento nos desarmó el mapa en la esquina. Quiero recordarte que el hogar no es una coordenada fija: es donde nos encontramos los dos.",
    date: "14 de Noviembre, 2024",
    year: "2024",
    category: "carta",
    location: "Estación Central",
    author: "Mili",
    imageUrl:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Carta manuscrita vintage con sello de lacre",
    imageCaption: "Sobre de algodón con membrete y sello de cera terracota",
    tags: ["Cartas", "Distancia", "Promesa"],
    readingTime: "4 min de lectura",
    aspectRatio: "portrait",
  },
  {
    id: "demo-recuerdo-02",
    title: "Librerías de viejo y café con lluvia en San Telmo",
    subtitle: "Paseo de sábado",
    excerpt:
      "Nos perdimos entre estanterías de libros usados durante tres horas. Compramos dos postales de 1954 que nadie reclamó y nos quedamos en la mesa del rincón mirando llover sobre los adoquines húmedos.",
    date: "12 de Octubre, 2024",
    year: "2024",
    category: "recuerdo",
    location: "San Telmo, CABA",
    author: "Mili",
    imageUrl:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Pluma estilográfica y páginas amarillentas de libros clásicos",
    imageCaption: "Kodak Portra 400 • Luz natural filtrada por la vidriera",
    tags: ["Libros", "Lluvia", "Adoquines"],
    aspectRatio: "landscape",
  },
];
