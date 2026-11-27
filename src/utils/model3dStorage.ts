const DB_NAME = "detodito_models_3d_v1";
const DB_VERSION = 1;
const STORE_NAME = "models";
const IDB_PREFIX = "idb://";

const MAX_MODEL_3D_TOTAL_BYTES = 50 * 1024 * 1024;

interface StoredModelRecord {
  id: string;
  name: string;
  blob: Blob;
  createdAt: string;
}

export function isStoredModelRef(src?: string | null): boolean {
  return Boolean(src && src.startsWith(IDB_PREFIX));
}

function getRecordId(ref: string): string {
  return ref.slice(IDB_PREFIX.length);
}

function openModelsDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Este navegador no soporta IndexedDB para modelos 3D."));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("No se pudo abrir el almacenamiento 3D."));
  });
}

function generateModelRecordId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `model-${crypto.randomUUID()}`;
  }
  return `model-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function saveModelBlobToIdb(
  blob: Blob,
  name: string,
): Promise<string> {
  const db = await openModelsDb();
  const id = generateModelRecordId();
  const record: StoredModelRecord = {
    id,
    name,
    blob,
    createdAt: new Date().toISOString(),
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(record);
    tx.oncomplete = () => {
      db.close();
      resolve(`${IDB_PREFIX}${id}`);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error ?? new Error("No se pudo guardar el modelo 3D."));
    };
  });
}

export async function loadModelBlobFromIdb(
  ref: string,
): Promise<{ blob: Blob; name: string } | null> {
  if (!isStoredModelRef(ref)) return null;
  const db = await openModelsDb();
  const id = getRecordId(ref);

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(id);
    req.onsuccess = () => {
      db.close();
      const record = req.result as StoredModelRecord | undefined;
      resolve(record ? { blob: record.blob, name: record.name } : null);
    };
    req.onerror = () => {
      db.close();
      reject(req.error ?? new Error("No se pudo leer el modelo 3D."));
    };
  });
}

export async function deleteModelBlobFromIdb(ref: string): Promise<void> {
  if (!isStoredModelRef(ref)) return;
  try {
    const db = await openModelsDb();
    const id = getRecordId(ref);
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).delete(id);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  } catch (error) {
    console.error("No se pudo eliminar el modelo 3D de IndexedDB:", error);
  }
}

function fileToDataUrl(file: File, fallbackMime: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error(`No se pudo leer el archivo ${file.name}.`));
        return;
      }
      if (
        reader.result.startsWith("data:application/octet-stream") ||
        reader.result.startsWith("data:;")
      ) {
        const commaIndex = reader.result.indexOf(",");
        const base64 = commaIndex >= 0 ? reader.result.slice(commaIndex + 1) : "";
        resolve(`data:${fallbackMime};base64,${base64}`);
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () =>
      reject(new Error(`No se pudo leer el archivo ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

function guessMimeByFilename(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".ktx2")) return "image/ktx2";
  return "application/octet-stream";
}

function normalizeRelativePath(rawPath: string): string {
  return rawPath
    .replace(/\\/g, "/")
    .replace(/^\.\//, "")
    .replace(/^\/+/, "")
    .toLowerCase();
}

export async function prepareGlbUpload(
  file: File,
): Promise<{ blob: Blob; label: string }> {
  if (!file.name.toLowerCase().endsWith(".glb")) {
    throw new Error("Para archivo único, seleccioná un modelo en formato .glb.");
  }
  if (file.size > MAX_MODEL_3D_TOTAL_BYTES) {
    throw new Error("El archivo .glb supera el límite de 50 MB.");
  }
  const buffer = await file.arrayBuffer();
  return {
    blob: new Blob([buffer], { type: "model/gltf-binary" }),
    label: file.name,
  };
}

export async function packGltfFolderUpload(
  files: File[],
): Promise<{ blob: Blob; label: string }> {
  if (files.length === 0) {
    throw new Error("No se encontraron archivos en la carpeta seleccionada.");
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > MAX_MODEL_3D_TOTAL_BYTES) {
    throw new Error("La carpeta del modelo 3D supera el límite de 50 MB.");
  }

  const singleGlb = files.find((f) => f.name.toLowerCase().endsWith(".glb"));
  const gltfFile = files.find((f) => f.name.toLowerCase().endsWith(".gltf"));

  if (!gltfFile && singleGlb) {
    return prepareGlbUpload(singleGlb);
  }

  if (!gltfFile) {
    throw new Error(
      "La carpeta debe contener un archivo .gltf (junto con sus .bin y texturas) o un archivo .glb.",
    );
  }

  const gltfRelPath = (gltfFile.webkitRelativePath || gltfFile.name).replace(
    /\\/g,
    "/",
  );
  const gltfDir = gltfRelPath.includes("/")
    ? gltfRelPath.slice(0, gltfRelPath.lastIndexOf("/") + 1)
    : "";

  const fileByRelative = new Map<string, File>();
  const fileByBaseName = new Map<string, File>();

  for (const file of files) {
    const fullRel = (file.webkitRelativePath || file.name).replace(/\\/g, "/");
    const relativeToGltf =
      gltfDir && fullRel.startsWith(gltfDir)
        ? fullRel.slice(gltfDir.length)
        : fullRel;

    fileByRelative.set(normalizeRelativePath(relativeToGltf), file);
    fileByRelative.set(normalizeRelativePath(fullRel), file);
    fileByBaseName.set(file.name.toLowerCase(), file);
  }

  let parsedGltf: Record<string, unknown>;
  try {
    parsedGltf = JSON.parse(await gltfFile.text()) as Record<string, unknown>;
  } catch {
    throw new Error("El archivo .gltf no tiene un formato JSON válido.");
  }

  const resolveReferencedFile = (uri: string): File | undefined => {
    let decoded: string;
    try {
      decoded = decodeURIComponent(uri);
    } catch {
      decoded = uri;
    }
    const cleanRel = normalizeRelativePath(decoded);
    const byRel = fileByRelative.get(cleanRel);
    if (byRel) return byRel;

    const baseName = cleanRel.split("/").pop() ?? cleanRel;
    return fileByBaseName.get(baseName);
  };

  const missingRefs: string[] = [];

  if (Array.isArray(parsedGltf.buffers)) {
    for (const rawBuffer of parsedGltf.buffers) {
      if (
        !rawBuffer ||
        typeof rawBuffer !== "object" ||
        typeof (rawBuffer as { uri?: unknown }).uri !== "string"
      ) {
        continue;
      }
      const bufferEntry = rawBuffer as { uri: string };
      if (
        bufferEntry.uri.startsWith("data:") ||
        bufferEntry.uri.startsWith("http://") ||
        bufferEntry.uri.startsWith("https://")
      ) {
        continue;
      }
      const match = resolveReferencedFile(bufferEntry.uri);
      if (!match) {
        missingRefs.push(bufferEntry.uri);
        continue;
      }
      bufferEntry.uri = await fileToDataUrl(match, "application/octet-stream");
    }
  }

  if (Array.isArray(parsedGltf.images)) {
    for (const rawImage of parsedGltf.images) {
      if (
        !rawImage ||
        typeof rawImage !== "object" ||
        typeof (rawImage as { uri?: unknown }).uri !== "string"
      ) {
        continue;
      }
      const imageEntry = rawImage as { uri: string; mimeType?: string };
      if (
        imageEntry.uri.startsWith("data:") ||
        imageEntry.uri.startsWith("http://") ||
        imageEntry.uri.startsWith("https://")
      ) {
        continue;
      }
      const match = resolveReferencedFile(imageEntry.uri);
      if (!match) {
        missingRefs.push(imageEntry.uri);
        continue;
      }
      const mime =
        imageEntry.mimeType || match.type || guessMimeByFilename(match.name);
      imageEntry.uri = await fileToDataUrl(match, mime);
    }
  }

  if (missingRefs.length > 0) {
    throw new Error(
      `Faltan archivos referenciados por el .gltf: ${missingRefs.slice(0, 3).join(", ")}${missingRefs.length > 3 ? "..." : ""}. Seleccioná la carpeta completa.`,
    );
  }

  const folderName =
    gltfRelPath.includes("/") ? gltfRelPath.split("/")[0] : gltfFile.name;

  return {
    blob: new Blob([JSON.stringify(parsedGltf)], { type: "model/gltf+json" }),
    label: `${folderName} (${files.length} archivos empaquetados)`,
  };
}
