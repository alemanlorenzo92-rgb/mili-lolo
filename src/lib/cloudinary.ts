import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const MAX_MEDIA_FILE_SIZE_MB = 50;
export const MAX_MEDIA_FILE_SIZE_BYTES = MAX_MEDIA_FILE_SIZE_MB * 1024 * 1024; // 52,428,800 bytes

export const ALLOWED_MEDIA_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
] as const;

export type AllowedMediaMimeType = (typeof ALLOWED_MEDIA_MIME_TYPES)[number];

const DISALLOWED_FTYP_IMAGE_BRANDS = new Set([
  "heic",
  "heix",
  "hevc",
  "heim",
  "heis",
  "hevm",
  "hevs",
  "mif1",
  "msf1",
  "avif",
  "avis",
]);

export interface DetectedMediaInfo {
  mimeType: AllowedMediaMimeType;
  resourceType: "image" | "video";
  format: "jpg" | "png" | "webp" | "mp4";
}

export type MediaValidationResult =
  | ({
      ok: true;
      bytes: number;
    } & DetectedMediaInfo)
  | {
      ok: false;
      error: string;
    };

export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudName && apiKey && apiSecret);
}

export function getMissingCloudinaryKeys(): string[] {
  const missing: string[] = [];
  if (!cloudName) missing.push("CLOUDINARY_CLOUD_NAME");
  if (!apiKey) missing.push("CLOUDINARY_API_KEY");
  if (!apiSecret) missing.push("CLOUDINARY_API_SECRET");
  return missing;
}

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

function normalizeDeclaredMimeType(rawMime: string | undefined): string {
  if (!rawMime) return "";
  const cleaned = rawMime.trim().toLowerCase();
  if (cleaned === "image/jpg") {
    return "image/jpeg";
  }
  return cleaned;
}

/**
 * Inspecciona los magic bytes reales del buffer para verificar que el archivo
 * corresponda efectivamente a JPG, PNG, WebP o MP4 y no a un tipo falsificado.
 */
export function detectRealMediaType(buffer: Buffer): DetectedMediaInfo | null {
  if (!buffer || buffer.byteLength < 4) {
    return null;
  }

  // JPEG: FF D8 FF
  if (
    buffer.byteLength >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return {
      mimeType: "image/jpeg",
      resourceType: "image",
      format: "jpg",
    };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.byteLength >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return {
      mimeType: "image/png",
      resourceType: "image",
      format: "png",
    };
  }

  // WebP: "RIFF" en 0..3 y "WEBP" en 8..11
  if (
    buffer.byteLength >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return {
      mimeType: "image/webp",
      resourceType: "image",
      format: "webp",
    };
  }

  // MP4: caja ISO BMFF "ftyp" en bytes 4..7 (excluyendo contenedores HEIC/AVIF)
  if (
    buffer.byteLength >= 12 &&
    buffer.toString("ascii", 4, 8) === "ftyp"
  ) {
    const majorBrand = buffer.toString("ascii", 8, 12).toLowerCase();
    if (!DISALLOWED_FTYP_IMAGE_BRANDS.has(majorBrand)) {
      return {
        mimeType: "video/mp4",
        resourceType: "video",
        format: "mp4",
      };
    }
  }

  return null;
}

export function validateMediaBuffer(
  buffer: Buffer,
  declaredMimeType?: string,
  declaredSize?: number
): MediaValidationResult {
  const actualBytes = buffer?.byteLength ?? 0;

  if (actualBytes <= 0 || (typeof declaredSize === "number" && declaredSize <= 0)) {
    return {
      ok: false,
      error: "El archivo seleccionado está vacío.",
    };
  }

  if (
    actualBytes > MAX_MEDIA_FILE_SIZE_BYTES ||
    (typeof declaredSize === "number" && declaredSize > MAX_MEDIA_FILE_SIZE_BYTES)
  ) {
    return {
      ok: false,
      error: `El archivo supera el límite máximo permitido de ${MAX_MEDIA_FILE_SIZE_MB} MB.`,
    };
  }

  const normalizedMime = normalizeDeclaredMimeType(declaredMimeType);
  if (
    normalizedMime &&
    !(ALLOWED_MEDIA_MIME_TYPES as readonly string[]).includes(normalizedMime)
  ) {
    return {
      ok: false,
      error:
        "Tipo de archivo no permitido. Solo se aceptan imágenes JPG, PNG, WebP o videos MP4 de hasta 50 MB.",
    };
  }

  const detected = detectRealMediaType(buffer);
  if (!detected) {
    return {
      ok: false,
      error:
        "El contenido real del archivo no es válido. Solo se permiten archivos JPG, PNG, WebP o MP4 auténticos.",
    };
  }

  if (normalizedMime && normalizedMime !== detected.mimeType) {
    return {
      ok: false,
      error:
        "El tipo de archivo declarado no coincide con su contenido binario real.",
    };
  }

  return {
    ok: true,
    bytes: actualBytes,
    ...detected,
  };
}

export interface UploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format?: string;
  resourceType: "image" | "video";
  bytes?: number;
  width?: number;
  height?: number;
}

export async function uploadMediaBuffer(
  buffer: Buffer,
  options: {
    folder?: string;
    resourceType?: "image" | "video" | "auto";
    declaredMimeType?: string;
  } = {}
): Promise<UploadResult> {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      `Cloudinary no está configurado. Variables faltantes: ${getMissingCloudinaryKeys().join(", ")}`
    );
  }

  const validation = validateMediaBuffer(buffer, options.declaredMimeType);
  if (!validation.ok) {
    throw new Error(validation.error);
  }

  const { folder = "mili-lolo/recuerdos" } = options;
  const resolvedResourceType =
    options.resourceType && options.resourceType !== "auto"
      ? options.resourceType
      : validation.resourceType;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resolvedResourceType,
        allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4"],
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Error desconocido al subir a Cloudinary"));
        }

        resolve({
          url: result.url,
          secureUrl: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          resourceType: (result.resource_type === "video" ? "video" : "image") as "image" | "video",
          bytes: result.bytes,
          width: result.width,
          height: result.height,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

export async function deleteMediaFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" = "image"
): Promise<boolean> {
  if (!isCloudinaryConfigured() || !publicId) {
    return false;
  }

  try {
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return res.result === "ok";
  } catch (error) {
    console.error("Error al eliminar archivo de Cloudinary:", error);
    return false;
  }
}
