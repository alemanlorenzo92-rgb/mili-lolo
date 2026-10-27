"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Camera,
  Feather,
  Heart,
  Lock,
  Menu,
  X,
} from "lucide-react";
import { UserMenu } from "./UserMenu";

interface HeaderProps {
  currentUser?: {
    displayName: string;
    username: string;
  } | null;
}

export function Header({ currentUser }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Recuerdos", href: "/recuerdos", icon: Camera },
    { label: "Diario", href: "/diario", icon: BookOpen },
    { label: "Cartas", href: "/cartas", icon: Feather },
    { label: "Cronología", href: "/timeline", icon: CalendarDays },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E6DFD3] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Lado izquierdo: Metadatos editoriales / Archivo */}
          <div className="hidden md:flex items-center space-x-3 text-xs tracking-widest uppercase text-[#827B73]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#92543E]/70 animate-pulse" />
            <span className="font-medium">Vol. I &bull; Archivo Íntimo</span>
            <span className="text-[#D6CEBF]">&bull;</span>
            <span className="italic normal-case tracking-normal text-[#9E978F]">
              Mili &amp; Lolo
            </span>
          </div>

          {/* Centro: Título y Monograma */}
          <div className="flex flex-col items-center text-center">
            <Link
              href="/"
              className="group flex flex-col items-center focus:outline-none"
            >
              <div className="flex items-center space-x-1.5">
                <span className="font-serif text-2xl sm:text-3xl tracking-tight text-[#1C1A17] group-hover:text-[#92543E] transition-colors duration-200">
                  Mili
                </span>
                <Heart className="w-3.5 h-3.5 fill-[#92543E] text-[#92543E] animate-heart-pulse" />
                <span className="font-serif text-2xl sm:text-3xl tracking-tight text-[#1C1A17] group-hover:text-[#92543E] transition-colors duration-200">
                  Lolo
                </span>
              </div>
              <span className="text-[10px] tracking-[0.28em] uppercase text-[#827B73] font-medium -mt-0.5">
                Nuestro Cuaderno Íntimo
              </span>
            </Link>
          </div>

          {/* Lado derecho: Navegación de escritorio y usuario */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-5 text-sm">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center space-x-1.5 text-[#4A453F] hover:text-[#92543E] transition-colors duration-200 py-1"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#9E978F] group-hover:text-[#92543E] transition-colors" />
                    <span className="tracking-wide text-xs">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="h-4 w-px bg-[#E6DFD3]" />

            {currentUser ? (
              <UserMenu user={currentUser} />
            ) : (
              <div
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full border border-[#E6DFD3] bg-[#F4EFE6]/60 text-[#827B73] text-[11px] tracking-wider uppercase"
                title="Espacio privado para dos personas"
              >
                <Lock className="w-3 h-3 text-[#92543E]" />
                <span className="font-medium">Privado</span>
              </div>
            )}
          </div>

          {/* Botón de menú móvil */}
          <div className="flex items-center space-x-3 md:hidden">
            {currentUser && <UserMenu user={currentUser} />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#4A453F] hover:text-[#1C1A17] focus:outline-none"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E6DFD3] bg-[#FAF8F5] px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-xs uppercase tracking-widest text-[#827B73] mb-2 font-medium">
            Secciones del Cuaderno
          </div>
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-[#1C1A17] hover:text-[#92543E] border-b border-[#F0EBE2] text-sm"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-[#92543E]" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-xs text-[#9E978F] font-serif italic">
                    Abrir &rarr;
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 flex flex-col space-y-2">
            <Link
              href="/recuerdos/nuevo"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-4 text-center rounded-xl bg-[#1C1A17] text-white text-xs uppercase tracking-wider font-medium"
            >
              + Nuevo Recuerdo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
