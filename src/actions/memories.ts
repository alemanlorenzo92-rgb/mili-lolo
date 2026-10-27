"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  deleteMediaFromCloudinary,
  isCloudinaryConfigured,
  MAX_MEDIA_FILE_SIZE_BYTES,
  MAX_MEDIA_FILE_SIZE_MB,
  uploadMediaBuffer,
  UploadResult,
  validateMediaBuffer,
} from "@/lib/cloudinary";

const MemorySchema = z.object({
  title: z.string().trim().min(2, "El título debe tener al menos 2 caracteres"),
  subtitle: z.string().trim().optional(),
  description: z.string().trim().min(5, "Escribe una descripción o memoria más completa"),
  date: z
    .string()
    .min(1, "Selecciona una fecha válida")
    .refine((val) => !Number.isNaN(new Date(val).getTime()), {
      message: "Selecciona una fecha válida",
    }),
  location: z.string().trim().optional(),
  isFeatured: z.boolean().default(false),
  chapter: z.string().trim().optional(),
  coverUrl: z
    .string()
    .trim()
    .url("URL de imagen o video no válida")
    .refine(
      (val) => {
        try {
          const parsed = new URL(val);
          return parsed.protocol === "https:";
        } catch {
          return false;
        }
      },
      { message: "La URL externa debe comenzar con https://" }
    )
    .optional()
    .or(z.literal("")),
  coverCaption: z.string().trim().optional(),
  tags: z.string().optional(), // separados por coma
});

export type MemoryActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createMemoryAction(
  prevState: MemoryActionState,
  formData: FormData
): Promise<MemoryActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "No tienes una sesión activa para realizar esta acción." };
  }

  const rawCoverUrl = ((formData.get("coverUrl") as string) || "").trim();

  const rawData = {
    title: ((formData.get("title") as string) || "").trim(),
    subtitle: ((formData.get("subtitle") as string) || "").trim() || undefined,
    description: ((formData.get("description") as string) || "").trim(),
    date: ((formData.get("date") as string) || "").trim(),
    location: ((formData.get("location") as string) || "").trim() || undefined,
    isFeatured: formData.get("isFeatured") === "on",
    chapter: ((formData.get("chapter") as string) || "").trim() || undefined,
    coverUrl: rawCoverUrl || undefined,
    coverCaption: ((formData.get("coverCaption") as string) || "").trim() || undefined,
    tags: ((formData.get("tags") as string) || "").trim() || undefined,
  };

  const parsed = MemorySchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      error: "Por favor corrige los datos del formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  // Manejo de archivo subido si existe y validación estricta en servidor
  let finalCoverUrl = data.coverUrl || undefined;
  let uploadedMediaAsset: UploadResult | null = null;

  const fileEntry = formData.get("file");
  const file = fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null;

  if (file) {
    if (file.size > MAX_MEDIA_FILE_SIZE_BYTES) {
      const sizeError = `El archivo supera el límite máximo permitido de ${MAX_MEDIA_FILE_SIZE_MB} MB.`;
      return {
        error: sizeError,
        fieldErrors: { file: [sizeError] },
      };
    }

    if (!isCloudinaryConfigured()) {
      return {
        error:
          "Para subir fotos o videos directamente desde tu dispositivo debes configurar Cloudinary en el servidor. También puedes pegar una URL externa directamente en el campo inferior.",
      };
    }

    let buffer: Buffer;
    try {
      buffer = Buffer.from(await file.arrayBuffer());
    } catch {
      return {
        error: "No se pudo leer el archivo enviado. Intenta seleccionarlo nuevamente.",
      };
    }

    const mediaValidation = validateMediaBuffer(buffer, file.type, file.size);
    if (!mediaValidation.ok) {
      return {
        error: mediaValidation.error,
        fieldErrors: { file: [mediaValidation.error] },
      };
    }

    try {
      const uploadRes = await uploadMediaBuffer(buffer, {
        resourceType: mediaValidation.resourceType,
        declaredMimeType: mediaValidation.mimeType,
      });

      uploadedMediaAsset = uploadRes;
      finalCoverUrl = uploadRes.secureUrl;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al subir archivo";
      return { error: `Fallo de subida: ${msg}` };
    }
  }

  // Parsear y deduplicar etiquetas para evitar fallos de clave única
  const tagNames = Array.from(
    new Set(
      data.tags
        ? data.tags
            .split(",")
            .map((t) => t.trim().toLowerCase())
            .filter((t) => t.length > 0)
        : []
    )
  );

  let createdMemoryId: string;

  try {
    // Crear recuerdo, activo multimedia y etiquetas de forma atómica para evitar registros huérfanos
    const memory = await prisma.$transaction(async (tx) => {
      const created = await tx.memory.create({
        data: {
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          date: new Date(data.date),
          location: data.location,
          isFeatured: data.isFeatured,
          chapter: data.chapter,
          coverUrl: finalCoverUrl,
          coverCaption: data.coverCaption,
          authorId: user.id,
          media: uploadedMediaAsset
            ? {
                create: {
                  url: uploadedMediaAsset.url,
                  secureUrl: uploadedMediaAsset.secureUrl,
                  publicId: uploadedMediaAsset.publicId,
                  resourceType: uploadedMediaAsset.resourceType,
                  format: uploadedMediaAsset.format,
                  bytes: uploadedMediaAsset.bytes,
                  width: uploadedMediaAsset.width,
                  height: uploadedMediaAsset.height,
                  caption: data.coverCaption,
                },
              }
            : undefined,
        },
      });

      for (const tagName of tagNames) {
        const tag = await tx.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        });

        await tx.memoryTag.create({
          data: {
            memoryId: created.id,
            tagId: tag.id,
          },
        });
      }

      return created;
    });

    createdMemoryId = memory.id;
  } catch {
    // Si la etapa de base de datos falla luego de subir a Cloudinary, revertir el archivo subido
    if (uploadedMediaAsset?.publicId) {
      await deleteMediaFromCloudinary(
        uploadedMediaAsset.publicId,
        uploadedMediaAsset.resourceType
      );
    }

    return {
      error: "No se pudo guardar el recuerdo en la base de datos. Intenta nuevamente.",
    };
  }

  revalidatePath("/");
  revalidatePath("/recuerdos");
  revalidatePath("/timeline");
  redirect(`/recuerdos/${createdMemoryId}`);
}

export async function updateMemoryAction(
  memoryId: string,
  prevState: MemoryActionState,
  formData: FormData
): Promise<MemoryActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "No tienes una sesión activa para realizar esta acción." };
  }

  const trimmedMemoryId = memoryId?.trim();
  if (!trimmedMemoryId) {
    notFound();
  }

  const existingMemory = await prisma.memory.findUnique({
    where: { id: trimmedMemoryId },
    select: {
      id: true,
      coverUrl: true,
      chapter: true,
    },
  });

  if (!existingMemory) {
    notFound();
  }

  const rawCoverUrl = ((formData.get("coverUrl") as string) || "").trim();
  const hasChapterField = formData.has("chapter");

  const rawData = {
    title: ((formData.get("title") as string) || "").trim(),
    subtitle: ((formData.get("subtitle") as string) || "").trim() || undefined,
    description: ((formData.get("description") as string) || "").trim(),
    date: ((formData.get("date") as string) || "").trim(),
    location: ((formData.get("location") as string) || "").trim() || undefined,
    isFeatured: formData.get("isFeatured") === "on",
    chapter: ((formData.get("chapter") as string) || "").trim() || undefined,
    coverUrl: rawCoverUrl || undefined,
    coverCaption: ((formData.get("coverCaption") as string) || "").trim() || undefined,
    tags: ((formData.get("tags") as string) || "").trim() || undefined,
  };

  const parsed = MemorySchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      error: "Por favor corrige los datos del formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  // Mantener portada actual si no hay cambios; si se sube archivo nuevo o URL externa HTTPS, actualizarla
  let finalCoverUrl: string | null = data.coverUrl || existingMemory.coverUrl || null;
  let uploadedMediaAsset: UploadResult | null = null;

  const fileEntry = formData.get("file");
  const file = fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null;

  if (file) {
    if (file.size > MAX_MEDIA_FILE_SIZE_BYTES) {
      const sizeError = `El archivo supera el límite máximo permitido de ${MAX_MEDIA_FILE_SIZE_MB} MB.`;
      return {
        error: sizeError,
        fieldErrors: { file: [sizeError] },
      };
    }

    if (!isCloudinaryConfigured()) {
      return {
        error:
          "Para subir fotos o videos directamente desde tu dispositivo debes configurar Cloudinary en el servidor. También puedes pegar una URL externa directamente en el campo inferior.",
      };
    }

    let buffer: Buffer;
    try {
      buffer = Buffer.from(await file.arrayBuffer());
    } catch {
      return {
        error: "No se pudo leer el archivo enviado. Intenta seleccionarlo nuevamente.",
      };
    }

    const mediaValidation = validateMediaBuffer(buffer, file.type, file.size);
    if (!mediaValidation.ok) {
      return {
        error: mediaValidation.error,
        fieldErrors: { file: [mediaValidation.error] },
      };
    }

    try {
      const uploadRes = await uploadMediaBuffer(buffer, {
        resourceType: mediaValidation.resourceType,
        declaredMimeType: mediaValidation.mimeType,
      });

      uploadedMediaAsset = uploadRes;
      finalCoverUrl = uploadRes.secureUrl;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al subir archivo";
      return { error: `Fallo de subida: ${msg}` };
    }
  }

  // Parsear y deduplicar etiquetas para evitar fallos de clave única
  const tagNames = Array.from(
    new Set(
      data.tags
        ? data.tags
            .split(",")
            .map((t) => t.trim().toLowerCase())
            .filter((t) => t.length > 0)
        : []
    )
  );

  try {
    // Actualizar recuerdo, activo multimedia nuevo (si aplica) y etiquetas de forma atómica sin eliminar archivos ni activos previos
    await prisma.$transaction(async (tx) => {
      await tx.memory.update({
        where: { id: existingMemory.id },
        data: {
          title: data.title,
          subtitle: data.subtitle ?? null,
          description: data.description,
          date: new Date(data.date),
          location: data.location ?? null,
          isFeatured: data.isFeatured,
          chapter: hasChapterField ? data.chapter ?? null : existingMemory.chapter,
          coverUrl: finalCoverUrl,
          coverCaption: data.coverCaption ?? null,
          media: uploadedMediaAsset
            ? {
                create: {
                  url: uploadedMediaAsset.url,
                  secureUrl: uploadedMediaAsset.secureUrl,
                  publicId: uploadedMediaAsset.publicId,
                  resourceType: uploadedMediaAsset.resourceType,
                  format: uploadedMediaAsset.format,
                  bytes: uploadedMediaAsset.bytes,
                  width: uploadedMediaAsset.width,
                  height: uploadedMediaAsset.height,
                  caption: data.coverCaption,
                },
              }
            : undefined,
        },
      });

      const desiredTagIds: string[] = [];

      for (const tagName of tagNames) {
        const tag = await tx.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        });
        desiredTagIds.push(tag.id);
      }

      if (desiredTagIds.length > 0) {
        await tx.memoryTag.deleteMany({
          where: {
            memoryId: existingMemory.id,
            tagId: { notIn: desiredTagIds },
          },
        });
      } else {
        await tx.memoryTag.deleteMany({
          where: { memoryId: existingMemory.id },
        });
      }

      for (const tagId of desiredTagIds) {
        await tx.memoryTag.upsert({
          where: {
            memoryId_tagId: {
              memoryId: existingMemory.id,
              tagId,
            },
          },
          update: {},
          create: {
            memoryId: existingMemory.id,
            tagId,
          },
        });
      }
    });
  } catch {
    // Si la etapa de base de datos falla luego de subir un archivo nuevo a Cloudinary, revertir únicamente el archivo recién subido
    if (uploadedMediaAsset?.publicId) {
      await deleteMediaFromCloudinary(
        uploadedMediaAsset.publicId,
        uploadedMediaAsset.resourceType
      );
    }

    return {
      error: "No se pudo actualizar el recuerdo en la base de datos. Intenta nuevamente.",
    };
  }

  revalidatePath("/");
  revalidatePath("/recuerdos");
  revalidatePath(`/recuerdos/${existingMemory.id}`);
  revalidatePath("/timeline");
  redirect(`/recuerdos/${existingMemory.id}`);
}

export async function deleteMemoryAction(memoryId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autorizado");
  }

  const mediaList = await prisma.mediaAsset.findMany({
    where: { memoryId },
    select: { publicId: true, resourceType: true },
  });

  await prisma.memory.delete({
    where: { id: memoryId },
  });

  // Eliminar archivos en Cloudinary luego de confirmar el borrado en DB
  for (const media of mediaList) {
    if (media.publicId) {
      await deleteMediaFromCloudinary(
        media.publicId,
        media.resourceType === "video" ? "video" : "image"
      );
    }
  }

  revalidatePath("/");
  revalidatePath("/recuerdos");
  revalidatePath("/timeline");
  redirect("/recuerdos");
}
