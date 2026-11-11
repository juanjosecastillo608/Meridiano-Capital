import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";

/**
 * Almacenamiento privado de documentos: disco local fuera de /public y de git
 * (STORAGE_DIR). Los archivos solo se sirven a través de rutas que verifican
 * sesión y sociedad. Reemplazable por S3/GCS con cifrado en producción (PD-11).
 */
function base(): string {
  return path.resolve(process.env.STORAGE_DIR ?? "./storage");
}

export async function guardarArchivo(buffer: Buffer, nombre: string, carpeta: string) {
  const sha256 = createHash("sha256").update(buffer).digest("hex");
  const ext = path.extname(nombre).toLowerCase().replace(/[^.a-z0-9]/g, "");
  const storageKey = path.posix.join(carpeta.replace(/[^a-z0-9/_-]/gi, ""), `${randomUUID()}${ext}`);
  const destino = path.join(base(), storageKey);
  await mkdir(path.dirname(destino), { recursive: true });
  await writeFile(destino, buffer, { mode: 0o600 });
  return { storageKey, sha256, tamanoBytes: buffer.length };
}

export async function leerArchivo(storageKey: string): Promise<Buffer> {
  const ruta = path.resolve(base(), storageKey);
  if (!ruta.startsWith(base() + path.sep)) throw new Error("Ruta de almacenamiento inválida.");
  return readFile(ruta);
}
