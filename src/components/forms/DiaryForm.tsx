"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Smile } from "lucide-react";
import {
  createDiaryEntryAction,
  DiaryActionState,
  updateDiaryEntryAction,
} from "@/actions/diary";

const initialState: DiaryActionState = {};

export interface DiaryFormInitialData {
  id: string;
  title: string;
  content: string;
  date: Date | string;
  location?: string | null;
  mood?: string | null;
}

interface DiaryFormProps {
  initialData?: DiaryFormInitialData;
}

function formatDateForInput(dateValue?: Date | string): string {
  const parsed = dateValue ? new Date(dateValue) : new Date();
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().split("T")[0];
  }
  return parsed.toISOString().split("T")[0];
}

export function DiaryForm({ initialData }: DiaryFormProps = {}) {
  const isEditing = Boolean(initialData);
  const action = initialData
    ? updateDiaryEntryAction.bind(null, initialData.id)
    : createDiaryEntryAction;

  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <div className="p-4 rounded-xl border border-[#D97757]/40 bg-[#F4EDE7] text-[#92543E] text-xs leading-relaxed animate-in fade-in duration-200">
          <p className="font-medium">{state.error}</p>
        </div>
      )}

      {/* Título */}
      <div className="space-y-1.5">
        <label htmlFor="title" className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium">
          Título de la Entrada *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={initialData?.title ?? ""}
          placeholder="ej. El café de las ocho y los domingos lentos"
          className="w-full px-4 py-3 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-sm text-[#1C1A17] focus:outline-none focus:border-[#92543E] transition-all font-serif"
        />
        {state?.fieldErrors?.title && (
          <p className="text-[11px] text-[#92543E]">{state.fieldErrors.title[0]}</p>
        )}
      </div>

      {/* Fecha, Estado de Ánimo y Lugar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <label htmlFor="date" className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium">
            Fecha *
          </label>
          <div className="relative">
            <input
              id="date"
              name="date"
              type="date"
              required
              defaultValue={formatDateForInput(initialData?.date)}
              className="w-full px-4 py-2.5 pl-10 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-xs text-[#1C1A17] focus:outline-none focus:border-[#92543E]"
            />
            <Calendar className="w-4 h-4 text-[#9E978F] absolute left-3.5 top-3" />
          </div>
          {state?.fieldErrors?.date && (
            <p className="text-[11px] text-[#92543E]">{state.fieldErrors.date[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="location" className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium">
            Ubicación
          </label>
          <div className="relative">
            <input
              id="location"
              name="location"
              type="text"
              defaultValue={initialData?.location ?? ""}
              placeholder="ej. Balcón de casa"
              className="w-full px-4 py-2.5 pl-10 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-xs text-[#1C1A17] focus:outline-none focus:border-[#92543E]"
            />
            <MapPin className="w-4 h-4 text-[#9E978F] absolute left-3.5 top-3" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="mood" className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium">
            Tono o Clima Emocional
          </label>
          <div className="relative">
            <input
              id="mood"
              name="mood"
              type="text"
              defaultValue={initialData?.mood ?? ""}
              placeholder="ej. Calma, gratitud, nostalgia"
              className="w-full px-4 py-2.5 pl-10 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-xs text-[#1C1A17] focus:outline-none focus:border-[#92543E]"
            />
            <Smile className="w-4 h-4 text-[#9E978F] absolute left-3.5 top-3" />
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="space-y-1.5">
        <label htmlFor="content" className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium">
          Anotación del Diario *
        </label>
        <textarea
          id="content"
          name="content"
          rows={10}
          required
          defaultValue={initialData?.content ?? ""}
          placeholder="Escribí sin apuro. Es un espacio íntimo pensado para registrar reflexiones, recuerdos compartidos y conversaciones cotidianas..."
          className="w-full p-4 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-base text-[#1C1A17] leading-relaxed focus:outline-none focus:border-[#92543E] transition-all font-serif"
        />
        {state?.fieldErrors?.content && (
          <p className="text-[11px] text-[#92543E]">{state.fieldErrors.content[0]}</p>
        )}
      </div>

      {/* Acciones */}
      <div className="pt-6 border-t border-[#E6DFD3] flex items-center justify-between">
        <Link
          href={initialData ? `/diario/${initialData.id}` : "/diario"}
          className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider text-[#827B73] hover:text-[#1C1A17] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Cancelar</span>
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-3.5 rounded-xl bg-[#1C1A17] hover:bg-[#92543E] text-[#FAF8F5] text-xs uppercase tracking-widest font-medium transition-all duration-300 disabled:opacity-60 shadow-sm"
        >
          {isPending
            ? isEditing
              ? "Guardando cambios..."
              : "Guardando en el diario..."
            : isEditing
              ? "Guardar Cambios"
              : "Guardar Anotación"}
        </button>
      </div>
    </form>
  );
}
