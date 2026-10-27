"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Send } from "lucide-react";
import { createLetterAction, LetterActionState } from "@/actions/letters";

const initialState: LetterActionState = {};

interface LetterFormProps {
  recipients: { id: string; displayName: string }[];
  currentUserId: string;
}

export function LetterForm({ recipients, currentUserId }: LetterFormProps) {
  const [state, formAction, isPending] = useActionState(createLetterAction, initialState);

  // Seleccionar automáticamente al otro usuario si está disponible
  const defaultRecipient = recipients.find((r) => r.id !== currentUserId) || recipients[0];

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <div className="p-4 rounded-xl border border-[#D97757]/40 bg-[#F4EDE7] text-[#92543E] text-xs leading-relaxed animate-in fade-in duration-200">
          <p className="font-medium">{state.error}</p>
        </div>
      )}

      {/* Destinatario y Fecha */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label htmlFor="recipientId" className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium">
            Destinatario de la Carta *
          </label>
          <div className="relative">
            <select
              id="recipientId"
              name="recipientId"
              required
              defaultValue={defaultRecipient?.id}
              className="w-full px-4 py-3 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-sm text-[#1C1A17] focus:outline-none focus:border-[#92543E] transition-all"
            >
              {recipients.map((r) => (
                <option key={r.id} value={r.id}>
                  Para {r.displayName} {r.id === currentUserId ? "(Nota para mí)" : ""}
                </option>
              ))}
            </select>
          </div>
          {state?.fieldErrors?.recipientId && (
            <p className="text-[11px] text-[#92543E]">{state.fieldErrors.recipientId[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="date" className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium">
            Fecha de Envío *
          </label>
          <div className="relative">
            <input
              id="date"
              name="date"
              type="date"
              required
              defaultValue={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 pl-11 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-sm text-[#1C1A17] focus:outline-none focus:border-[#92543E]"
            />
            <Calendar className="w-4 h-4 text-[#9E978F] absolute left-4 top-3.5" />
          </div>
        </div>
      </div>

      {/* Título de la Carta */}
      <div className="space-y-1.5">
        <label htmlFor="title" className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium">
          Título o Asunto de la Carta *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="ej. Para cuando el viaje parezca largo"
          className="w-full px-4 py-3 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-sm text-[#1C1A17] focus:outline-none focus:border-[#92543E] transition-all font-serif"
        />
        {state?.fieldErrors?.title && (
          <p className="text-[11px] text-[#92543E]">{state.fieldErrors.title[0]}</p>
        )}
      </div>

      {/* Ubicación y Color de Lacre */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label htmlFor="location" className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium">
            Lugar de Redacción
          </label>
          <div className="relative">
            <input
              id="location"
              name="location"
              type="text"
              placeholder="ej. Mirando por la ventanilla del tren"
              className="w-full px-4 py-2.5 pl-10 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-xs text-[#1C1A17] focus:outline-none focus:border-[#92543E]"
            />
            <MapPin className="w-4 h-4 text-[#9E978F] absolute left-3.5 top-3" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="sealColor" className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium">
            Tono del Sello de Lacre
          </label>
          <select
            id="sealColor"
            name="sealColor"
            defaultValue="terracotta"
            className="w-full px-4 py-2.5 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-xs text-[#1C1A17] focus:outline-none focus:border-[#92543E]"
          >
            <option value="terracotta">Lacre Terracota (Cálido Clásico)</option>
            <option value="olive">Lacre Oliva (Silencioso y Calmo)</option>
            <option value="espresso">Lacre Tinta Café (Íntimo y Profundo)</option>
          </select>
        </div>
      </div>

      {/* Contenido / Carta */}
      <div className="space-y-1.5">
        <label htmlFor="content" className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium">
          Cuerpo de la Carta *
        </label>
        <textarea
          id="content"
          name="content"
          rows={12}
          required
          placeholder="Escribí como si estuvieras dejando una carta en una mesa de luz o dentro de un libro querido. Sin apuro..."
          className="w-full p-6 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-base text-[#1C1A17] leading-relaxed focus:outline-none focus:border-[#92543E] transition-all font-serif italic"
        />
        {state?.fieldErrors?.content && (
          <p className="text-[11px] text-[#92543E]">{state.fieldErrors.content[0]}</p>
        )}
      </div>

      {/* Acciones */}
      <div className="pt-6 border-t border-[#E6DFD3] flex items-center justify-between">
        <Link
          href="/cartas"
          className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider text-[#827B73] hover:text-[#1C1A17] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Cancelar</span>
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-3.5 rounded-xl bg-[#1C1A17] hover:bg-[#92543E] text-[#FAF8F5] text-xs uppercase tracking-widest font-medium transition-all duration-300 disabled:opacity-60 shadow-sm flex items-center space-x-2"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isPending ? "Sellando sobre..." : "Sellar y Guardar Carta"}</span>
        </button>
      </div>
    </form>
  );
}
