"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Camera,
  MapPin,
  Tag,
  Upload,
} from "lucide-react";
import {
  createMemoryAction,
  MemoryActionState,
  updateMemoryAction,
} from "@/actions/memories";

const initialState: MemoryActionState = {};

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_CLIENT_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "video/mp4",
]);

export interface MemoryFormInitialData {
  id: string;
  title: string;
  subtitle?: string | null;
  chapter?: string | null;
  description: string;
  date: Date | string;
  location?: string | null;
  isFeatured?: boolean;
  coverUrl?: string | null;
  coverCaption?: string | null;
  tags?: string[];
}

interface MemoryFormProps {
  isCloudinaryReady: boolean;
  initialData?: MemoryFormInitialData;
}

function formatDateForInput(dateValue?: Date | string): string {
  const parsed = dateValue ? new Date(dateValue) : new Date();
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().split("T")[0];
  }
  return parsed.toISOString().split("T")[0];
}

export function MemoryForm({ isCloudinaryReady, initialData }: MemoryFormProps) {
  const isEditing = Boolean(initialData);
  const action = initialData
    ? updateMemoryAction.bind(null, initialData.id)
    : createMemoryAction;

  const [state, formAction, isPending] = useActionState(action, initialState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [clientFileError, setClientFileError] = useState<string | null>(null);

  const activePreviewUrl = previewUrl ?? initialData?.coverUrl ?? null;
  const isVideoPreview = selectedFile
    ? selectedFile.type.toLowerCase().startsWith("video/")
    : Boolean(activePreviewUrl && /\/video\/upload\/|\.mp4(\?|$)/i.test(activePreviewUrl));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setClientFileError(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    const normalizedType = file.type.trim().toLowerCase();
    if (!ALLOWED_CLIENT_MIME_TYPES.has(normalizedType)) {
      e.target.value = "";
      setSelectedFile(null);
      setPreviewUrl(null);
      setClientFileError(
        "Formato no permitido. Seleccioná un archivo JPG, PNG, WebP o MP4."
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      e.target.value = "";
      setSelectedFile(null);
      setPreviewUrl(null);
      setClientFileError(
        `El archivo supera el límite máximo permitido de ${MAX_FILE_SIZE_MB} MB.`
      );
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <div className="p-4 rounded-xl border border-[#D97757]/40 bg-[#F4EDE7] text-[#92543E] text-xs leading-relaxed animate-in fade-in duration-200">
          <p className="font-medium">{state.error}</p>
        </div>
      )}

      {/* Título y Subtítulo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label htmlFor="title" className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium">
            Título del Recuerdo *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={initialData?.title ?? ""}
            placeholder="ej. Tarde de lluvia en el mirador"
            className="w-full px-4 py-3 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-sm text-[#1C1A17] focus:outline-none focus:border-[#92543E] transition-all"
          />
          {state?.fieldErrors?.title && (
            <p className="text-[11px] text-[#92543E]">{state.fieldErrors.title[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="subtitle" className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium">
            Subtítulo o Nota Breve
          </label>
          <input
            id="subtitle"
            name="subtitle"
            type="text"
            defaultValue={initialData?.subtitle ?? ""}
            placeholder="ej. Capítulo III &bull; Verano en el sur"
            className="w-full px-4 py-3 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-sm text-[#1C1A17] focus:outline-none focus:border-[#92543E] transition-all"
          />
        </div>
      </div>

      {/* Fecha, Lugar y Capítulo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <label htmlFor="date" className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium">
            Fecha del Momento *
          </label>
          <div className="relative">
            <input
              id="date"
              name="date"
              type="date"
              required
              defaultValue={formatDateForInput(initialData?.date)}
              className="w-full px-4 py-3 pl-11 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-sm text-[#1C1A17] focus:outline-none focus:border-[#92543E] transition-all"
            />
            <Calendar className="w-4 h-4 text-[#9E978F] absolute left-4 top-3.5" />
          </div>
          {state?.fieldErrors?.date && (
            <p className="text-[11px] text-[#92543E]">{state.fieldErrors.date[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="location" className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium">
            Ubicación o Lugar
          </label>
          <div className="relative">
            <input
              id="location"
              name="location"
              type="text"
              defaultValue={initialData?.location ?? ""}
              placeholder="ej. San Martín de los Andes"
              className="w-full px-4 py-3 pl-11 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-sm text-[#1C1A17] focus:outline-none focus:border-[#92543E] transition-all"
            />
            <MapPin className="w-4 h-4 text-[#9E978F] absolute left-4 top-3.5" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="chapter" className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium">
            Capítulo Editorial
          </label>
          <input
            id="chapter"
            name="chapter"
            type="text"
            defaultValue={initialData?.chapter ?? ""}
            placeholder="ej. Capítulo I &bull; El Sur"
            className="w-full px-4 py-3 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-sm text-[#1C1A17] focus:outline-none focus:border-[#92543E] transition-all"
          />
        </div>
      </div>

      {/* Fotografía o Multimedia */}
      <div className="p-6 rounded-2xl border border-[#E6DFD3] bg-[#F4EFE6]/50 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#1C1A17] flex items-center space-x-2">
            <Camera className="w-4 h-4 text-[#92543E]" />
            <span>Fotografía o Video de Portada</span>
          </span>
          <span className="text-[11px] font-mono text-[#827B73]">
            {isCloudinaryReady ? "Cloudinary Activo" : "URL Externa / Modo Enlace"}
          </span>
        </div>

        {isCloudinaryReady ? (
          <div className="space-y-4">
            <label className="block border-2 border-dashed border-[#D6CEBF] rounded-xl p-6 text-center cursor-pointer hover:border-[#92543E] transition-colors bg-[#FAF8F5]">
              <Upload className="w-8 h-8 mx-auto text-[#92543E] mb-2" />
              <span className="text-xs text-[#4A453F] block font-medium">
                {selectedFile
                  ? selectedFile.name
                  : isEditing && initialData?.coverUrl
                    ? "Seleccionar nueva imagen o video para reemplazar la portada (opcional)"
                    : "Seleccionar imagen o video desde tu dispositivo"}
              </span>
              <span className="text-[11px] text-[#827B73] block mt-1">
                JPG, PNG, WebP o MP4 hasta 50MB
              </span>
              <input
                type="file"
                name="file"
                accept="image/jpeg,image/png,image/webp,video/mp4"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {(clientFileError || state?.fieldErrors?.file?.[0]) && (
              <p className="text-[11px] text-[#92543E]">
                {clientFileError || state?.fieldErrors?.file?.[0]}
              </p>
            )}
            {activePreviewUrl && (
              <div className="mt-4 relative aspect-[16/9] max-w-sm rounded-lg overflow-hidden border border-[#E6DFD3]">
                {isVideoPreview ? (
                  <video
                    src={activePreviewUrl}
                    controls
                    playsInline
                    className="object-cover w-full h-full"
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={activePreviewUrl} alt="Vista previa" className="object-cover w-full h-full" />
                )}
              </div>
            )}
            <div className="text-xs text-[#6E6862] space-y-2 pt-2 border-t border-[#E6DFD3]/60">
              <label htmlFor="coverUrl" className="block italic font-serif">
                O bien ingresá una URL externa HTTPS si preferís no subir archivo desde tu dispositivo:
              </label>
              <input
                id="coverUrl"
                name="coverUrl"
                type="url"
                defaultValue={initialData?.coverUrl ?? ""}
                placeholder="https://images.unsplash.com/... o enlace seguro"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-xs text-[#1C1A17] focus:outline-none focus:border-[#92543E]"
              />
              {state?.fieldErrors?.coverUrl && (
                <p className="text-[11px] text-[#92543E]">{state.fieldErrors.coverUrl[0]}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-xs text-[#6E6862] space-y-3">
            <p className="italic font-serif">
              Podés ingresar una URL segura HTTPS de imagen mientras terminás de configurar las credenciales de Cloudinary:
            </p>
            <input
              id="coverUrl"
              name="coverUrl"
              type="url"
              defaultValue={initialData?.coverUrl ?? ""}
              placeholder="https://images.unsplash.com/... o enlace seguro"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-xs text-[#1C1A17] focus:outline-none focus:border-[#92543E]"
            />
            {state?.fieldErrors?.coverUrl && (
              <p className="text-[11px] text-[#92543E]">{state.fieldErrors.coverUrl[0]}</p>
            )}
          </div>
        )}

        <div className="space-y-1.5 pt-2">
          <label htmlFor="coverCaption" className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium">
            Pie de Foto Editorial (opcional)
          </label>
          <input
            id="coverCaption"
            name="coverCaption"
            type="text"
            defaultValue={initialData?.coverCaption ?? ""}
            placeholder="ej. Fotograma 35mm &bull; Atardecer a orillas del lago"
            className="w-full px-4 py-2.5 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-xs text-[#1C1A17] focus:outline-none focus:border-[#92543E]"
          />
        </div>
      </div>

      {/* Descripción / Crónica */}
      <div className="space-y-1.5">
        <label htmlFor="description" className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium">
          Historia o Crónica del Momento *
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          required
          defaultValue={initialData?.description ?? ""}
          placeholder="Escribí los detalles que no querés que se borren: las palabras que se dijeron, el sonido del viento, lo que sentimos..."
          className="w-full px-4 py-3 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-sm text-[#1C1A17] leading-relaxed focus:outline-none focus:border-[#92543E] transition-all font-serif"
        />
        {state?.fieldErrors?.description && (
          <p className="text-[11px] text-[#92543E]">{state.fieldErrors.description[0]}</p>
        )}
      </div>

      {/* Etiquetas y Destacado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-1.5">
          <label htmlFor="tags" className="block text-xs uppercase tracking-wider text-[#6E6862] font-medium">
            Etiquetas (separadas por comas)
          </label>
          <div className="relative">
            <input
              id="tags"
              name="tags"
              type="text"
              defaultValue={initialData?.tags?.join(", ") ?? ""}
              placeholder="viaje, nieve, café, atardecer"
              className="w-full px-4 py-3 pl-11 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] text-sm text-[#1C1A17] focus:outline-none focus:border-[#92543E]"
            />
            <Tag className="w-4 h-4 text-[#9E978F] absolute left-4 top-3.5" />
          </div>
        </div>

        <div className="pt-5 flex items-center space-x-3">
          <input
            id="isFeatured"
            name="isFeatured"
            type="checkbox"
            defaultChecked={Boolean(initialData?.isFeatured)}
            className="w-4 h-4 rounded border-[#E6DFD3] text-[#92543E] focus:ring-[#92543E]"
          />
          <label htmlFor="isFeatured" className="text-xs text-[#4A453F] font-medium cursor-pointer">
            Marcar como Fotografía / Historia Destacada en Portada
          </label>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="pt-6 border-t border-[#E6DFD3] flex items-center justify-between">
        <Link
          href={initialData ? `/recuerdos/${initialData.id}` : "/recuerdos"}
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
              : "Guardando en el archivo..."
            : isEditing
              ? "Guardar Cambios"
              : "Guardar Recuerdo"}
        </button>
      </div>
    </form>
  );
}
