"use client";

import { useActionState } from "react";
import { ArrowRight, CheckCircle2, Lock, Mail, User } from "lucide-react";
import { setupAction, ActionState } from "@/actions/auth";

const initialState: ActionState = {};

export function SetupForm() {
  const [state, formAction, isPending] = useActionState(setupAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="p-4 rounded-xl border border-[#D97757]/40 bg-[#F4EDE7] text-[#92543E] text-xs leading-relaxed animate-in fade-in duration-200">
          <p className="font-medium">{state.error}</p>
        </div>
      )}

      {/* Nombre visible */}
      <div className="space-y-1.5">
        <label
          htmlFor="displayName"
          className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium"
        >
          Nombre Visible (ej. Mili o Lolo)
        </label>
        <div className="relative">
          <input
            id="displayName"
            name="displayName"
            type="text"
            required
            placeholder="Mili o Lolo"
            className="w-full px-4 py-2.5 pl-10 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-sm text-[#1C1A17] placeholder-[#A8A29E] focus:outline-none focus:border-[#92543E] transition-all"
          />
          <User className="w-4 h-4 text-[#9E978F] absolute left-3.5 top-3" />
        </div>
        {state?.fieldErrors?.displayName && (
          <p className="text-[11px] text-[#92543E]">
            {state.fieldErrors.displayName[0]}
          </p>
        )}
      </div>

      {/* Usuario */}
      <div className="space-y-1.5">
        <label
          htmlFor="username"
          className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium"
        >
          Nombre de Usuario
        </label>
        <div className="relative">
          <input
            id="username"
            name="username"
            type="text"
            required
            autoCapitalize="none"
            placeholder="mili"
            className="w-full px-4 py-2.5 pl-10 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-sm text-[#1C1A17] placeholder-[#A8A29E] focus:outline-none focus:border-[#92543E] transition-all"
          />
          <span className="absolute left-3.5 top-2.5 text-xs text-[#9E978F] font-mono">
            @
          </span>
        </div>
        {state?.fieldErrors?.username && (
          <p className="text-[11px] text-[#92543E]">
            {state.fieldErrors.username[0]}
          </p>
        )}
      </div>

      {/* Correo */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium"
        >
          Correo Electrónico
        </label>
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="tu-correo@ejemplo.com"
            className="w-full px-4 py-2.5 pl-10 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-sm text-[#1C1A17] placeholder-[#A8A29E] focus:outline-none focus:border-[#92543E] transition-all"
          />
          <Mail className="w-4 h-4 text-[#9E978F] absolute left-3.5 top-3" />
        </div>
        {state?.fieldErrors?.email && (
          <p className="text-[11px] text-[#92543E]">
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>

      {/* Contraseña */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium"
          >
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="mínimo 8 caract."
              className="w-full px-4 py-2.5 pl-10 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-sm text-[#1C1A17] placeholder-[#A8A29E] focus:outline-none focus:border-[#92543E] transition-all"
            />
            <Lock className="w-4 h-4 text-[#9E978F] absolute left-3.5 top-3" />
          </div>
          {state?.fieldErrors?.password && (
            <p className="text-[11px] text-[#92543E]">
              {state.fieldErrors.password[0]}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium"
          >
            Confirmar
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="repetir contraseña"
              className="w-full px-4 py-2.5 pl-10 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-sm text-[#1C1A17] placeholder-[#A8A29E] focus:outline-none focus:border-[#92543E] transition-all"
            />
            <CheckCircle2 className="w-4 h-4 text-[#9E978F] absolute left-3.5 top-3" />
          </div>
          {state?.fieldErrors?.confirmPassword && (
            <p className="text-[11px] text-[#92543E]">
              {state.fieldErrors.confirmPassword[0]}
            </p>
          )}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full group flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl bg-[#1C1A17] hover:bg-[#92543E] text-[#FAF8F5] text-xs uppercase tracking-widest font-medium transition-all duration-300 disabled:opacity-60 shadow-sm"
        >
          <span>{isPending ? "Guardando cuenta..." : "Crear Cuenta de Acceso"}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </form>
  );
}
