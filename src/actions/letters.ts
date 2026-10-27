"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const LetterSchema = z.object({
  title: z.string().min(2, "El título de la carta debe tener al menos 2 caracteres"),
  content: z.string().min(5, "Escribe el cuerpo de tu carta"),
  date: z.string().min(1, "Selecciona una fecha"),
  location: z.string().optional(),
  sealColor: z.string().default("terracotta"),
  recipientId: z.string().min(1, "Selecciona el destinatario"),
});

export type LetterActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createLetterAction(
  prevState: LetterActionState,
  formData: FormData
): Promise<LetterActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "No tienes una sesión activa para enviar una carta." };
  }

  const rawData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    date: formData.get("date") as string,
    location: (formData.get("location") as string) || undefined,
    sealColor: (formData.get("sealColor") as string) || "terracotta",
    recipientId: formData.get("recipientId") as string,
  };

  const parsed = LetterSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      error: "Por favor revisa los datos de la carta.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { title, content, date, location, sealColor, recipientId } = parsed.data;

  const letter = await prisma.letter.create({
    data: {
      title,
      content,
      date: new Date(date),
      location,
      sealColor,
      senderId: user.id,
      recipientId,
    },
  });

  revalidatePath("/");
  revalidatePath("/cartas");
  redirect(`/cartas/${letter.id}`);
}

export async function markLetterAsReadAction(letterId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autorizado");
  }

  const letter = await prisma.letter.findUnique({
    where: { id: letterId },
  });

  if (!letter) return;

  // Solo el destinatario marca como leída
  if (letter.recipientId === user.id && !letter.isRead) {
    await prisma.letter.update({
      where: { id: letterId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
    revalidatePath(`/cartas/${letterId}`);
    revalidatePath("/cartas");
  }
}

export async function deleteLetterAction(id: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autorizado");
  }

  await prisma.letter.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/cartas");
  redirect("/cartas");
}
