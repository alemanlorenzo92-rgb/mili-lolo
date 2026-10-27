"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  AuthConfigurationError,
  createSession,
  destroySession,
  getAuthSecretKey,
  isSetupAllowed,
  registerInitialUser,
  sanitizeRedirectPath,
  verifyPassword,
} from "@/lib/auth";

const LoginSchema = z.object({
  identifier: z.string().min(1, "Ingresa tu usuario o correo electrónico"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

const SetupSchema = z.object({
  displayName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  username: z
    .string()
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .regex(/^[a-zA-Z0-9_-]+$/, "El usuario solo puede contener letras, números, guiones y guiones bajos"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  confirmPassword: z.string().min(8, "Confirma tu contraseña"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export type ActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function loginAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  };

  const parsed = LoginSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      error: "Por favor revisa los datos ingresados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { identifier, password } = parsed.data;
  const trimmedIdentifier = identifier.trim();

  try {
    getAuthSecretKey();

    // Buscar usuario por correo o nombre de usuario
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: trimmedIdentifier, mode: "insensitive" } },
          { username: { equals: trimmedIdentifier, mode: "insensitive" } },
        ],
      },
    });

    if (!user) {
      return { error: "Credenciales inválidas. Verifica tu usuario o contraseña." };
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return { error: "Credenciales inválidas. Verifica tu usuario o contraseña." };
    }

    await createSession(user.id);
  } catch (error) {
    if (error instanceof AuthConfigurationError) {
      return {
        error: "No se pudo iniciar sesión por un problema de configuración del servidor.",
      };
    }
    return {
      error: "No se pudo iniciar sesión en este momento. Intenta nuevamente.",
    };
  }

  const safeRedirectTo = sanitizeRedirectPath(formData.get("redirectTo"));
  redirect(safeRedirectTo);
}

export async function setupAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const allowed = await isSetupAllowed();
  if (!allowed) {
    return { error: "El registro inicial ya está completado. Acceso cerrado." };
  }

  const rawData = {
    displayName: formData.get("displayName"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = SetupSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      error: "Por favor corrige los errores en el formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { displayName, username, email, password } = parsed.data;

  const registration = await registerInitialUser({
    displayName,
    username,
    email,
    password,
  });

  if (!registration.ok) {
    return { error: registration.error };
  }

  try {
    await createSession(registration.user.id);
  } catch (error) {
    if (error instanceof AuthConfigurationError) {
      return {
        error: "La cuenta fue creada, pero falta configurar la sesión en el servidor.",
      };
    }
    return {
      error: "La cuenta fue creada, pero no se pudo iniciar sesión automáticamente. Por favor inicia sesión.",
    };
  }

  revalidatePath("/");
  redirect("/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
