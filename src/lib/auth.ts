import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE_NAME = "mili_lolo_session";
export const MAX_INITIAL_USERS = 2;

export class AuthConfigurationError extends Error {
  constructor(
    message = "Configuración de autenticación incompleta en el servidor."
  ) {
    super(message);
    this.name = "AuthConfigurationError";
  }
}

class SetupLimitExceededError extends Error {
  constructor() {
    super("El límite máximo de cuentas iniciales fue alcanzado.");
    this.name = "SetupLimitExceededError";
  }
}

export function getAuthSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.trim().length === 0) {
    throw new AuthConfigurationError();
  }
  return new TextEncoder().encode(secret);
}

export function sanitizeRedirectPath(target: unknown): string {
  if (typeof target !== "string") {
    return "/";
  }

  const trimmed = target.trim();
  if (
    !trimmed ||
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.includes("\\") ||
    /[\u0000-\u001F\u007F\s]/.test(trimmed)
  ) {
    return "/";
  }

  try {
    const baseOrigin = "http://localhost";
    const parsed = new URL(trimmed, baseOrigin);

    if (
      parsed.origin !== baseOrigin ||
      !parsed.pathname.startsWith("/") ||
      parsed.pathname.startsWith("//")
    ) {
      return "/";
    }

    if (parsed.pathname === "/login" || parsed.pathname === "/setup") {
      return "/";
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return "/";
  }
}

export interface SessionPayload {
  userId: string;
  username: string;
  displayName: string;
  role: string;
}

export type RegisterInitialUserInput = {
  displayName: string;
  username: string;
  email: string;
  password: string;
};

export type RegisterInitialUserResult =
  | {
      ok: true;
      user: {
        id: string;
        username: string;
        displayName: string;
        role: string;
      };
    }
  | {
      ok: false;
      code: "SETUP_CLOSED" | "USER_EXISTS" | "CONFIG_ERROR" | "INTERNAL_ERROR";
      error: string;
    };

function isPrismaUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function isSetupAllowed(): Promise<boolean> {
  try {
    const userCount = await prisma.user.count();
    return userCount < MAX_INITIAL_USERS;
  } catch {
    return false;
  }
}

export async function registerInitialUser(
  input: RegisterInitialUserInput
): Promise<RegisterInitialUserResult> {
  try {
    getAuthSecretKey();
  } catch {
    return {
      ok: false,
      code: "CONFIG_ERROR",
      error: "No se pudo completar el registro por un problema de configuración del servidor.",
    };
  }

  const normalizedDisplayName = input.displayName.trim();
  const normalizedUsername = input.username.trim().toLowerCase();
  const normalizedEmail = input.email.trim().toLowerCase();

  try {
    const preCount = await prisma.user.count();
    if (preCount >= MAX_INITIAL_USERS) {
      return {
        ok: false,
        code: "SETUP_CLOSED",
        error: "El registro inicial ya está completado. Acceso cerrado.",
      };
    }

    const passwordHash = await hashPassword(input.password);

    return await prisma.$transaction(async (tx) => {
      if (typeof tx.$executeRaw === "function") {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(72819402)`;
      }

      const currentCount = await tx.user.count();
      if (currentCount >= MAX_INITIAL_USERS) {
        return {
          ok: false as const,
          code: "SETUP_CLOSED" as const,
          error: "El registro inicial ya está completado. Acceso cerrado.",
        };
      }

      const existing = await tx.user.findFirst({
        where: {
          OR: [
            { email: { equals: normalizedEmail, mode: "insensitive" } },
            { username: { equals: normalizedUsername, mode: "insensitive" } },
          ],
        },
        select: { id: true },
      });

      if (existing) {
        return {
          ok: false as const,
          code: "USER_EXISTS" as const,
          error: "El usuario o correo electrónico ya se encuentra registrado.",
        };
      }

      const newUser = await tx.user.create({
        data: {
          displayName: normalizedDisplayName,
          username: normalizedUsername,
          email: normalizedEmail,
          passwordHash,
          role: "PARTNER",
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          role: true,
        },
      });

      const finalCount = await tx.user.count();
      if (finalCount > MAX_INITIAL_USERS) {
        throw new SetupLimitExceededError();
      }

      return {
        ok: true as const,
        user: newUser,
      };
    });
  } catch (error) {
    if (error instanceof SetupLimitExceededError) {
      return {
        ok: false,
        code: "SETUP_CLOSED",
        error: "El registro inicial ya está completado. Acceso cerrado.",
      };
    }

    if (isPrismaUniqueConstraintError(error)) {
      return {
        ok: false,
        code: "USER_EXISTS",
        error: "El usuario o correo electrónico ya se encuentra registrado.",
      };
    }

    return {
      ok: false,
      code: "INTERNAL_ERROR",
      error: "No se pudo completar el registro en este momento. Intenta nuevamente.",
    };
  }
}

export async function createSession(userId: string): Promise<string> {
  const secretKey = getAuthSecretKey();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, displayName: true, role: true },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  // Duración de la sesión: 30 días
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const token = await new SignJWT({
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey);

  // Registrar sesión en PostgreSQL
  await prisma.session.create({
    data: {
      sessionToken: token,
      userId: user.id,
      expiresAt,
    },
  });

  // Establecer cookie HTTP-only segura
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const secretKey = getAuthSecretKey();
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const payload = await verifySessionToken(token);
    if (!payload?.userId) {
      return null;
    }

    // Verificar que la sesión exista en PostgreSQL y no esté expirada
    const activeSession = await prisma.session.findUnique({
      where: { sessionToken: token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            displayName: true,
            role: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
      },
    });

    if (!activeSession || activeSession.expiresAt < new Date()) {
      return null;
    }

    return activeSession.user;
  } catch {
    return null;
  }
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    try {
      await prisma.session.delete({
        where: { sessionToken: token },
      });
    } catch {
      // Ignorar si ya fue eliminada
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}
