"use client";

import { useActionState } from "react";
import { ArrowRight, Lock, User } from "lucide-react";
import { loginAction, ActionState } from "@/actions/auth";

interface LoginFormProps {
  redirectTo?: string;
}

const initialState: ActionState = {};

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

      {state?.error && (
        <div className="p-4 rounded-xl border border-[#D97757]/40 bg-[#F4EDE7] text-[#92543E] text-xs leading-relaxed animate-in fade-in duration-200">
          <p className="font-medium">{state.error}</p>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="identifier"
          className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium"
        >
          Usuario o Correo
        </label>
        <div className="relative">
          <input
            id="identifier"
            name="identifier"
            type="text"
            required
            autoComplete="username"
            placeholder="mili o lolo"
            className="w-full px-4 py-3 pl-11 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-sm text-[#1C1A17] placeholder-[#A8A29E] focus:outline-none focus:border-[#92543E] focus:ring-1 focus:ring-[#92543E] transition-all"
          />
          <User className="w-4 h-4 text-[#9E978F] absolute left-4 top-3.5" />
        </div>
        {state?.fieldErrors?.identifier && (
          <p className="text-[11px] text-[#92543E]">
            {state.fieldErrors.identifier[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
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
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full px-4 py-3 pl-11 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-sm text-[#1C1A17] placeholder-[#A8A29E] focus:outline-none focus:border-[#92543E] focus:ring-1 focus:ring-[#92543E] transition-all"
          />
          <Lock className="w-4 h-4 text-[#9E978F] absolute left-4 top-3.5" />
        </div>
        {state?.fieldErrors?.password && (
          <p className="text-[11px] text-[#92543E]">
            {state.fieldErrors.password[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full group flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl bg-[#1C1A17] hover:bg-[#92543E] text-[#FAF8F5] text-xs uppercase tracking-widest font-medium transition-all duration-300 disabled:opacity-60 shadow-sm"
      >
        <span>{isPending ? "Accediendo..." : "Abrir Cuaderno"}</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </form>
  );
}
