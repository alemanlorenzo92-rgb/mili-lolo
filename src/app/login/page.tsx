import Link from "next/link";
import { Heart, UserPlus } from "lucide-react";
import { isSetupAllowed, sanitizeRedirectPath } from "@/lib/auth";
import { LoginForm } from "./LoginForm";
import { WaxSeal } from "@/components/romantic/WaxSeal";

interface LoginPageProps {
  searchParams: Promise<{ from?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const setupAllowed = await isSetupAllowed();
  const safeRedirectTo = params?.from ? sanitizeRedirectPath(params.from) : undefined;

  return (
    <div className="min-h-screen bg-[#FAF8F5] paper-texture flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        {/* Sello de Lacre Romántico */}
        <div className="flex justify-center mb-6">
          <WaxSeal size="lg" showHeart={true} />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1A17] font-normal tracking-tight flex items-center justify-center space-x-2">
          <span>Mili</span>
          <Heart className="w-4 h-4 fill-[#92543E] text-[#92543E] inline animate-heart-pulse" />
          <span>Lolo</span>
        </h1>
        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[#827B73] font-medium">
          Acceso Exclusivo &bull; Diario Íntimo
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white/90 backdrop-blur-sm p-8 sm:p-10 rounded-3xl border border-[#E6DFD3] photo-shadow">
          <LoginForm redirectTo={safeRedirectTo} />

          {/* Enlace para configuración inicial si faltan cuentas */}
          {setupAllowed && (
            <div className="mt-8 pt-6 border-t border-[#F0EBE2] text-center">
              <p className="text-xs text-[#827B73] mb-3 font-serif italic">
                El cuaderno aún no tiene sus dos cuentas configuradas.
              </p>
              <Link
                href="/setup"
                className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider text-[#92543E] hover:text-[#1C1A17] font-medium transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Configurar cuenta de Mili o Lolo</span>
              </Link>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-[#9E978F] font-serif italic">
          «Dos miradas que comparten el mismo horizonte»
        </p>
      </div>
    </div>
  );
}
