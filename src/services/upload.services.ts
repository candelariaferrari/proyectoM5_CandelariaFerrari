const MAX_FILE_SIZE_MB = 5;

interface PresignResponse {
  uploadUrl: string;
  publicUrl: string;
}

// Sube una imagen de producto a S3 sin que las credenciales de AWS pasen
// nunca por el navegador. 3 pasos:
// 1) le pedimos a nuestra Vercel Function (/api/presign) una URL temporal
// 2) subimos el archivo DIRECTO a S3 con esa URL (no pasa por nuestro backend)
// 3) devolvemos la URL pública para guardarla en el producto
export const uploadProductImage = async (file: File): Promise<string> => {
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new Error(`La imagen no puede pesar más de ${MAX_FILE_SIZE_MB}MB`);
  }

  const presignResponse = await fetch("/api/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, fileType: file.type }),
  });

  if (!presignResponse.ok) {
    throw new Error("No pudimos preparar la subida de la imagen");
  }

  const { uploadUrl, publicUrl }: PresignResponse = await presignResponse.json();

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("No pudimos subir la imagen a S3");
  }

  return publicUrl;
};
