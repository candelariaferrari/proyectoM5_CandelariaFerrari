import type { VercelRequest, VercelResponse } from "@vercel/node";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

// Cliente de S3: se arma acá, del lado del servidor. Las credenciales viven
// como variables de entorno de Vercel (sin prefijo VITE_), así que nunca
// terminan en el bundle que se manda al navegador.
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME as string;

// Solo dejamos subir imágenes, no cualquier tipo de archivo.
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Esta función solo sirve para pedir una URL de subida.
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { filename, fileType } = req.body as { filename?: string; fileType?: string };

    if (!filename || !fileType) {
      return res.status(400).json({ error: "Falta filename o fileType" });
    }

    if (!ALLOWED_TYPES.includes(fileType)) {
      return res.status(400).json({ error: "Tipo de archivo no permitido" });
    }

    // Path único: si dos admins suben "oso.png" el mismo día, no se pisan el archivo uno al otro.
    const key = `imgProducts/${randomUUID()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    // URL temporal (expira en 60 segundos) que autoriza ÚNICAMENTE este
    // PUT puntual, a esta key puntual. Nadie puede reusarla para otra cosa.
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    // La URL pública final (la que se guarda en el producto) no necesita
    // firma: la política del bucket ya permite leer cualquier cosa que
    // esté dentro de products/.
    const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return res.status(200).json({ uploadUrl, publicUrl });
  } catch (error) {
    console.error("Error generando presigned URL:", error);
    return res.status(500).json({ error: "No pudimos generar la URL de subida" });
  }
}
