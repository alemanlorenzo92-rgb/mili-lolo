import Link from "next/link";
import { Heart, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#E6DFD3] bg-[#F4EFE6]/70 text-[#4A453F] transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          {/* Columna principal */}
          <div className="md:col-span-6 space-y-4">
            <div className="font-serif text-3xl tracking-tight text-[#1C1A17] flex items-center space-x-2">
              <span>Mili</span>
              <Heart className="w-4 h-4 fill-[#92543E] text-[#92543E] inline" />
              <span>Lolo</span>
            </div>
            <p className="font-serif italic text-lg text-[#6E6862] max-w-md leading-relaxed">
              Un archivo privado concebido como un diario íntimo:
              guardar el peso de las miradas, la quietud de los viajes y las
              palabras que no queremos que el tiempo borre.
            </p>
            <div className="flex items-center space-x-2 text-xs text-[#827B73] pt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#92543E]" />
              <span className="uppercase tracking-widest font-medium">
                Acceso Exclusivo para Dos &bull; Cifrado y Privado
              </span>
            </div>
          </div>

          {/* Navegación rápida */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#1C1A17] font-semibold">
              Índice del Diario
            </h4>
            <ul className="space-y-2.5 text-sm text-[#6E6862]">
              <li>
                <Link
                  href="/recuerdos"
                  className="hover:text-[#92543E] transition-colors"
                >
                  Recuerdos Fotográficos
                </Link>
              </li>
              <li>
                <Link
                  href="/diario"
                  className="hover:text-[#92543E] transition-colors"
                >
                  Diario &amp; Anotaciones
                </Link>
              </li>
              <li>
                <Link
                  href="/cartas"
                  className="hover:text-[#92543E] transition-colors"
                >
                  Cartas y Correspondencia
                </Link>
              </li>
              <li>
                <Link
                  href="/timeline"
                  className="hover:text-[#92543E] transition-colors"
                >
                  Línea Temporal Unificada
                </Link>
              </li>
            </ul>
          </div>

          {/* Estado de arquitectura en producción */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#1C1A17] font-semibold">
              Ficha Técnica
            </h4>
            <div className="p-4 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] space-y-2 text-xs leading-relaxed text-[#6E6862]">
              <div className="flex items-center space-x-1.5 text-[#1C1A17] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5F634F]" />
                <span>Servicios de Producción Activos</span>
              </div>
              <p className="text-[11px] text-[#827B73]">
                PostgreSQL en Railway conectado, Prisma ORM con migraciones versionadas y autenticación segura con sesiones HTTP-only.
              </p>
            </div>
          </div>
        </div>

        {/* Separador inferior */}
        <div className="mt-14 pt-8 border-t border-[#E6DFD3]/80 flex flex-col sm:flex-row items-center justify-between text-xs text-[#827B73] gap-4">
          <p>
            &copy; 2026 Mili &amp; Lolo &bull; Archivo Privado y Confidencial.
          </p>
          <div className="flex items-center space-x-2 font-serif italic text-sm text-[#6E6862]">
            <span>«Lo esencial permanece cuando el ruido se apaga»</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
