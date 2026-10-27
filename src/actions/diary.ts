"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const DiarySchema = z.object({
  title: z.string().trim().min(2, "El título debe tener al menos 2 caracteres"),
  content: z.string().trim().min(5, "Escribe una reflexión o entrada para el diario"),
  date: z
    .string()
    .min(1, "Selecciona una fecha")
    .refine((val) => !Number.isNaN(new Date(val).getTime()), {
      message: "Selecciona una fecha válida",
    }),
  location: z.string().trim().optional(),
  mood: z.string().trim().optional(),
});

export type DiaryActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

function calculateReadingTime(content: string): string {
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 180));
  return `${minutes} min de lectura`;
}

export async function createDiaryEntryAction(
  prevState: DiaryActionState,
  formData: FormData
): Promise<DiaryActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "No tienes una sesión activa para escribir en el diario." };
  }

  const rawData = {
    title: ((formData.get("title") as string) || "").trim(),
    content: ((formData.get("content") as string) || "").trim(),
    date: ((formData.get("date") as string) || "").trim(),
    location: ((formData.get("location") as string) || "").trim() || undefined,
    mood: ((formData.get("mood") as string) || "").trim() || undefined,
  };

  const parsed = DiarySchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      error: "Por favor revisa los datos de la entrada.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { title, content, date, location, mood } = parsed.data;
  const readingTime = calculateReadingTime(content);

  const entry = await prisma.diaryEntry.create({
    data: {
      title,
      content,
      date: new Date(date),
      location,
      mood,
      readingTime,
      authorId: user.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/diario");
  revalidatePath(`/diario/${entry.id}`);
  revalidatePath("/timeline");
  redirect(`/diario/${entry.id}`);
}

export async function updateDiaryEntryAction(
  id: string,
  prevState: DiaryActionState,
  formData: FormData
): Promise<DiaryActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "No tienes una sesión activa para editar en el diario." };
  }

  const existingEntry = await prisma.diaryEntry.findUnique({
    where: { id },
    select: { id: true, authorId: true, createdAt: true },
  });

  if (!existingEntry) {
    notFound();
  }

  const rawData = {
    title: ((formData.get("title") as string) || "").trim(),
    content: ((formData.get("content") as string) || "").trim(),
    date: ((formData.get("date") as string) || "").trim(),
    location: ((formData.get("location") as string) || "").trim() || undefined,
    mood: ((formData.get("mood") as string) || "").trim() || undefined,
  };

  const parsed = DiarySchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      error: "Por favor revisa los datos de la entrada.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { title, content, date, location, mood } = parsed.data;
  const readingTime = calculateReadingTime(content);

  // Actualizar entrada conservando authorId y createdAt originales
  await prisma.diaryEntry.update({
    where: { id: existingEntry.id },
    data: {
      title,
      content,
      date: new Date(date),
      location: location ?? null,
      mood: mood ?? null,
      readingTime,
    },
  });

  revalidatePath("/");
  revalidatePath("/diario");
  revalidatePath(`/diario/${existingEntry.id}`);
  revalidatePath("/timeline");
  redirect(`/diario/${existingEntry.id}`);
}

export async function deleteDiaryEntryAction(id: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autorizado");
  }

  await prisma.diaryEntry.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/diario");
  revalidatePath("/timeline");
  redirect("/diario");
}
