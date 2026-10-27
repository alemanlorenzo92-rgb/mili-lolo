"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  BookOpen,
  Calendar,
  Camera,
  Feather,
  Heart,
  MapPin,
  Plus,
  User,
} from "lucide-react";

export interface RealMomentItem {
  id: string;
  type: "recuerdo" | "diario" | "carta";
  title: string;
  subtitle?: string | null;
  excerpt: string;
  date: Date;
  location?: string | null;
  author: string;
  imageUrl?: string | null;
  imageCaption?: string | null;
  tags?: string[];
  href: string;
}

interface RecentMomentsProps {
  moments: RealMomentItem[];
}

export function RecentMoments({ moments }: RecentMomentsProps) {
  const [activeFilter, setActiveFilter] = useState<"todos" | "recuerdo" | "diario" | "carta">("todos");

  const filteredMoments =
    activeFilter === "todos"
      ? moments
      : moments.filter((m) => m.type === activeFilter);

  const filterButtons: { label: string; value: "todos" | "recuerdo" | "diario" | "carta"; count: number }[] = [
    { label: "Todos", value: "todos", count: moments.length },
    {
      label: "Recuerdos",
      value: "recuerdo",
      count: moments.filter((m) => m.type === "recuerdo").length,
    },
    {
      label: "Diario",
      value: "diario",
      count: moments.filter((m) => m.type === "diario").length,
    },
    {
      label: "Cartas",
      value: "carta",
      count: moments.filter((m) => m.type === "carta").length,
    },
  ];

  return (
    <section id="momentos-recientes" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#92543E] font-medium mb-3">
              <span className="h-px w-6 bg-[#92543E]" />
              <Heart className="w-3 h-3 fill-[#92543E] text-[#92543E] animate-heart-pulse" />
              <span>Cronología Viva</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1A17] font-normal tracking-tight">
              Momentos Recientes
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/recuerdos/nuevo"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#1C1A17] hover:bg-[#92543E] text-white text-xs uppercase tracking-wider font-medium transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Registro</span>
            </Link>
          </div>
        </div>

        {moments.length === 0 ? (
          /* Estado vacío real */
          <div className="p-12 sm:p-16 rounded-2xl border border-[#E6DFD3] bg-white text-center max-w-2xl mx-auto space-y-6 photo-shadow">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#F4EFE6] flex items-center justify-center text-[#92543E]">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-[#1C1A17]">
              El cuaderno está esperando sus primeros momentos
            </h3>
            <p className="text-xs sm:text-sm text-[#6E6862] font-serif italic leading-relaxed max-w-md mx-auto">
              Cada fotografía que subas, cada anotación en el diario y cada carta enviada se organizarán automáticamente aquí en tiempo real.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/recuerdos/nuevo"
                className="px-5 py-2.5 rounded-xl bg-[#1C1A17] hover:bg-[#92543E] text-white text-xs uppercase tracking-wider font-medium transition-colors"
              >
                + Nuevo Recuerdo
              </Link>
              <Link
                href="/diario/nuevo"
                className="px-5 py-2.5 rounded-xl border border-[#E6DFD3] hover:border-[#92543E] text-[#1C1A17] text-xs uppercase tracking-wider font-medium transition-colors"
              >
                + Escribir en Diario
              </Link>
              <Link
                href="/cartas/nueva"
                className="px-5 py-2.5 rounded-xl border border-[#E6DFD3] hover:border-[#92543E] text-[#1C1A17] text-xs uppercase tracking-wider font-medium transition-colors"
              >
                + Enviar Carta
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Barra de Filtros */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#E6DFD3] pb-6 mb-12 gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {filterButtons.map((btn) => {
                  const isActive = activeFilter === btn.value;
                  return (
                    <button
                      key={btn.value}
                      onClick={() => setActiveFilter(btn.value)}
                      className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-[#1C1A17] text-[#FAF8F5] shadow-sm"
                          : "bg-[#F4EFE6]/60 text-[#6E6862] hover:bg-[#F4EFE6] hover:text-[#1C1A17]"
                      }`}
                    >
                      {btn.label}{" "}
                      <span
                        className={`ml-1 text-[10px] ${
                          isActive ? "text-[#D6CEBF]" : "text-[#9E978F]"
                        }`}
                      >
                        ({btn.count})
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="text-xs text-[#827B73] font-serif italic">
                Mostrando {filteredMoments.length} registros
              </div>
            </div>

            {/* Grilla Asimétrica */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {filteredMoments.map((moment, idx) => {
                const isWide = idx === 0 && activeFilter === "todos";
                const colSpan = isWide
                  ? "lg:col-span-12"
                  : idx % 3 === 0
                  ? "lg:col-span-7"
                  : "lg:col-span-5";

                const categoryStyle = {
                  recuerdo: {
                    label: "Recuerdo",
                    color: "bg-[#EAE4D9] text-[#4A453F]",
                    icon: Camera,
                  },
                  diario: {
                    label: "Diario",
                    color: "bg-[#EDF0E6] text-[#5F634F]",
                    icon: BookOpen,
                  },
                  carta: {
                    label: "Carta",
                    color: "bg-[#F4EDE7] text-[#92543E]",
                    icon: Feather,
                  },
                }[moment.type];

                const CategoryIcon = categoryStyle.icon;

                return (
                  <Link
                    key={moment.id}
                    href={moment.href}
                    className={`${colSpan} group relative flex flex-col rounded-2xl border border-[#E6DFD3] bg-[#FAF8F5] overflow-hidden photo-shadow transition-all duration-300 hover:border-[#92543E]/50 hover:-translate-y-0.5`}
                  >
                    <div
                      className={`grid ${
                        isWide
                          ? "grid-cols-1 md:grid-cols-12 items-stretch"
                          : "grid-cols-1"
                      }`}
                    >
                      {moment.imageUrl && (
                        <div
                          className={`relative overflow-hidden bg-[#EFE9DF] ${
                            isWide
                              ? "md:col-span-7 min-h-[340px] lg:min-h-[420px]"
                              : "aspect-[16/10] w-full"
                          }`}
                        >
                          <Image
                            src={moment.imageUrl}
                            alt={moment.title}
                            fill
                            sizes={
                              isWide
                                ? "(max-width: 768px) 100vw, 60vw"
                                : "(max-width: 1024px) 100vw, 40vw"
                            }
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                          {moment.imageCaption && (
                            <div className="absolute bottom-3 left-4 right-4">
                              <p className="font-serif italic text-xs text-white/90 drop-shadow line-clamp-1">
                                {moment.imageCaption}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      <div
                        className={`flex flex-col justify-between p-6 sm:p-8 ${
                          isWide ? "md:col-span-5" : ""
                        }`}
                      >
                        <div>
                          <div className="flex items-center space-x-2 mb-4">
                            <span
                              className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase ${categoryStyle.color}`}
                            >
                              <CategoryIcon className="w-3 h-3" />
                              <span>{categoryStyle.label}</span>
                            </span>

                            <span className="text-xs text-[#827B73] flex items-center space-x-1">
                              <User className="w-3 h-3 text-[#9E978F]" />
                              <span>Por {moment.author}</span>
                            </span>
                          </div>

                          <h3 className="font-serif text-2xl sm:text-3xl text-[#1C1A17] font-normal leading-snug group-hover:text-[#92543E] transition-colors">
                            {moment.title}
                          </h3>

                          {moment.subtitle && (
                            <div className="text-xs text-[#9E978F] uppercase tracking-wider font-mono mt-1">
                              {moment.subtitle}
                            </div>
                          )}

                          <p className="mt-4 text-xs sm:text-sm text-[#4A453F] leading-relaxed line-clamp-3">
                            {moment.excerpt}
                          </p>

                          {moment.tags && moment.tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {moment.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-[#E6DFD3] text-[#827B73] bg-[#F4EFE6]/50"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-8 pt-4 border-t border-[#F0EBE2] flex items-center justify-between text-xs text-[#827B73]">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5 text-[#9E978F]" />
                            <span>
                              {new Date(moment.date).toLocaleDateString("es-AR", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </span>

                          {moment.location && (
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-3.5 h-3.5 text-[#9E978F]" />
                              <span>{moment.location}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

      </div>
    </section>
  );
}
