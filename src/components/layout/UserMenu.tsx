"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, Plus } from "lucide-react";
import { logoutAction } from "@/actions/auth";

interface UserMenuProps {
  user: {
    displayName: string;
    username: string;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-[#E6DFD3] bg-[#F4EFE6]/60 hover:bg-[#F4EFE6] text-xs text-[#4A453F] transition-all"
      >
        <span className="w-2 h-2 rounded-full bg-[#5F634F]" />
        <span className="font-serif italic text-sm text-[#1C1A17]">
          {user.displayName}
        </span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-52 rounded-xl bg-white border border-[#E6DFD3] photo-shadow p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
          onMouseLeave={() => setOpen(false)}
        >
          <div className="px-3 py-2 border-b border-[#F0EBE2] mb-1">
            <p className="font-medium text-[#1C1A17]">{user.displayName}</p>
            <p className="text-[11px] text-[#827B73] font-mono">@{user.username}</p>
          </div>

          <div className="space-y-0.5 py-1">
            <Link
              href="/recuerdos/nuevo"
              onClick={() => setOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-[#4A453F] hover:bg-[#FAF8F5] hover:text-[#92543E] transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#92543E]" />
              <span>Añadir Recuerdo</span>
            </Link>
            <Link
              href="/diario/nuevo"
              onClick={() => setOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-[#4A453F] hover:bg-[#FAF8F5] hover:text-[#92543E] transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#92543E]" />
              <span>Escribir en Diario</span>
            </Link>
            <Link
              href="/cartas/nueva"
              onClick={() => setOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-[#4A453F] hover:bg-[#FAF8F5] hover:text-[#92543E] transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#92543E]" />
              <span>Enviar Carta</span>
            </Link>
          </div>

          <div className="pt-1 mt-1 border-t border-[#F0EBE2]">
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-[#92543E] hover:bg-[#F4EDE7] transition-colors text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar sesión</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
