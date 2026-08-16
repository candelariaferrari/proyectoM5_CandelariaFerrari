import { useState, type FormEvent, type ChangeEvent } from "react";
import { Modal } from "../ui/Modal";
import { createProduct, updateProduct } from "../../services/products.services";
import { uploadProductImage } from "../../services/upload.services";
import { CATEGORY_INFO, CATEGORY_IDS } from "../../constants/categories";
import type { Product, CategoryId, MinAge } from "../../types/product.types";

const MIN_AGE_OPTIONS: MinAge[] = [1, 3, 6, 8, 10, 12];

interface ProductFormProps {
  product: Product | null; // null = alta, Product = edición
  onClose: () => void;
  onSaved: () => void; // el admin refetchea la lista después de guardar
}

export const ProductForm = ({ product, onClose, onSaved }: ProductFormProps) => {
  const isEditing = product !== null;

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price.toString() ?? "");
  const [stock, setStock] = useState(product?.stock.toString() ?? "");
  const [categoryId, setCategoryId] = useState<CategoryId>(product?.categoryId ?? CATEGORY_IDS[0]);
  const [minAge, setMinAge] = useState<MinAge>(product?.minAge ?? 1);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Cuando el admin elige un archivo, lo subimos enseguida (no esperamos al
  // submit del form): pedimos la URL prefirmada a nuestra función serverless
  // y subimos la imagen directo a S3. Al terminar, guardamos la URL pública
  // resultante en `imageUrl`, que es lo que después viaja a Firestore.
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(null);
    setIsUploadingImage(true);
    try {
      const publicUrl = await uploadProductImage(file);
      setImageUrl(publicUrl);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "No pudimos subir la imagen");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // Firestore no acepta `undefined` como valor de campo (tira error), así
    // que si no hay imagen, directamente no incluimos la key en vez de
    // mandarla en undefined.
    const data = {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      categoryId,
      minAge,
      rating: product?.rating ?? { rate: 0, count: 0 }, // producto nuevo: todavía sin reseñas
      ...(imageUrl ? { imageUrl } : {}),
    };

    try {
      if (isEditing) {
        await updateProduct(product.id, data);
      } else {
        await createProduct(data);
      }
      onSaved();
      onClose();
    } catch {
      setError("No pudimos guardar el producto. Probá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose} maxWidthClassName="max-w-lg">
      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-3">
        <h2 className="font-heading font-extrabold text-xl text-azul-noche mb-1">
          {isEditing ? "Editar producto" : "Nuevo producto"}
        </h2>

        <label className="text-sm font-bold text-azul-noche">
          Nombre
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 border border-gris-claro rounded-input px-3 py-2 text-sm font-normal"
          />
        </label>

        <label className="text-sm font-bold text-azul-noche">
          Descripción
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full mt-1 border border-gris-claro rounded-input px-3 py-2 text-sm font-normal resize-none"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-bold text-azul-noche">
            Precio
            <input
              required
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full mt-1 border border-gris-claro rounded-input px-3 py-2 text-sm font-normal"
            />
          </label>

          <label className="text-sm font-bold text-azul-noche">
            Stock
            <input
              required
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full mt-1 border border-gris-claro rounded-input px-3 py-2 text-sm font-normal"
            />
          </label>

          <label className="text-sm font-bold text-azul-noche">
            Categoría
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value as CategoryId)}
              className="w-full mt-1 border border-gris-claro rounded-input px-3 py-2 text-sm font-normal"
            >
              {CATEGORY_IDS.map((id) => (
                <option key={id} value={id}>
                  {CATEGORY_INFO[id].label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-bold text-azul-noche">
            Edad mínima
            <select
              value={minAge}
              onChange={(e) => setMinAge(Number(e.target.value) as MinAge)}
              className="w-full mt-1 border border-gris-claro rounded-input px-3 py-2 text-sm font-normal"
            >
              {MIN_AGE_OPTIONS.map((age) => (
                <option key={age} value={age}>
                  {age}+
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="text-sm font-bold text-azul-noche">
          Imagen
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="w-full mt-1 border border-gris-claro rounded-input px-3 py-2 text-sm font-normal"
          />
        </label>

        {isUploadingImage && <p className="text-xs text-azul-noche/60">Subiendo imagen...</p>}
        {imageError && <p className="text-danger text-xs">{imageError}</p>}
        {imageUrl && !isUploadingImage && (
          <img src={imageUrl} alt="Vista previa" className="w-20 h-20 object-cover rounded-input border border-gris-claro" />
        )}

        {error && <p className="text-danger text-xs">{error}</p>}

        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 text-sm font-bold text-azul-noche border border-gris-claro rounded-pill py-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting || isUploadingImage}
            className="flex-1 bg-mostaza text-azul-noche font-extrabold rounded-pill py-2 disabled:opacity-50"
          >
            {submitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
