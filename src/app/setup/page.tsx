import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { isSetupAllowed, MAX_INITIAL_USERS } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SetupForm } from "./SetupForm";
import { WaxSeal } from "@/components/romantic/WaxSeal";

export default async function SetupPage() {
  const allowed = await isSetupAllowed();
  let currentCount = MAX_INITIAL_USERS;

  if (allowed) {
    try {
      currentCount = await prisma.user.count();
    } catch {
      currentCount = MAX_INITIAL_USERS;
    }
  }

  if (!allowed || currentCount >= MAX_INITIAL_USERS) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] paper-texture flex flex-col justify-center py-12 px-6">
        <div className="max-w-md mx-auto text-center space-y-6 bg-white p-8 rounded-2xl border border-[#E6DFD3] photo-shadow">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#EDF0E6] flex items-center justify-center text-[#5F634F]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl text-[#1C1A17]">
            Registro Completo y Cerrado
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6862] leading-relaxed font-serif italic">
            Este diario privado ya cuenta con las dos cuentas autorizadas de Mili y Lolo. Por motivos de estricta privacidad, no se permiten nuevos registros.
          </p>
          <div className="pt-4">
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#1C1A17] text-[#FAF8F5] text-xs uppercase tracking-widest font-medium hover:bg-[#92543E] transition-colors"
            >
              <span>Ir a la pantalla de acceso</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] paper-texture flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center px-4">
        <div className="flex justify-center mb-4">
          <WaxSeal size="lg" showHeart={true} />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1A17] font-normal">
          Configuración de Cuenta
        </h1>
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#827B73] font-medium">
          Cuenta {currentCount + 1} de 2 &bull; Espacio Íntimo
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="bg-white/90 backdrop-blur-sm p-8 sm:p-10 rounded-2xl border border-[#E6DFD3] photo-shadow">
          <SetupForm />

          <div className="mt-6 pt-6 border-t border-[#F0EBE2] text-center">
            <Link
              href="/login"
              className="inline-flex items-center space-x-1.5 text-xs text-[#827B73] hover:text-[#1C1A17] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a iniciar sesión</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
