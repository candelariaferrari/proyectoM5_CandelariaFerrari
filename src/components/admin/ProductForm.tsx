import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { Modal } from "../ui/Modal";
import { FormField, fieldInputClassName } from "../ui/FormField";
import { UploadIcon } from "../ui/icons";
import { Button } from "../ui/Button";
import { createProduct, updateProduct } from "../../services/products.services";
import { uploadProductImage } from "../../services/upload.services";
import { useToast } from "../../hooks/useToast";
import { CATEGORY_INFO, CATEGORY_IDS } from "../../constants/categories";
import type { Product, CategoryId, MinAge } from "../../types/product.types";

const MIN_AGE_OPTIONS: MinAge[] = [1, 3, 6, 8, 10, 12];
const MAX_NAME_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 300;

type ProductFormErrors = Partial<Record<"name" | "description" | "price" | "stock", string>>;

interface ProductFormProps {
  product: Product | null; // null = alta, Product = edición
  onClose: () => void;
  onSaved: () => void; // el admin refetchea la lista después de guardar
}

export const ProductForm = ({ product, onClose, onSaved }: ProductFormProps) => {
  const isEditing = product !== null;
  const { showToast } = useToast();

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price.toString() ?? "");
  const [stock, setStock] = useState(product?.stock.toString() ?? "");
  const [categoryId, setCategoryId] = useState<CategoryId>(product?.categoryId ?? CATEGORY_IDS[0]);
  const [minAge, setMinAge] = useState<MinAge>(product?.minAge ?? 1);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ProductFormErrors>({});

  // Qué se puede y qué no: nombre/descripción no pueden quedar vacíos (ni
  // ser solo espacios) ni pasarse del largo máximo; precio tiene que ser
  // mayor a $0 (0 no es un precio válido); stock no puede ser negativo (0
  // sí es válido, significa "sin stock", ya lo mostramos así en la UI).
  const validate = (): ProductFormErrors => {
    const nextErrors: ProductFormErrors = {};

    if (!name.trim()) {
      nextErrors.name = "El nombre es obligatorio.";
    } else if (name.trim().length > MAX_NAME_LENGTH) {
      nextErrors.name = `El nombre no puede superar los ${MAX_NAME_LENGTH} caracteres.`;
    }

    if (!description.trim()) {
      nextErrors.description = "La descripción es obligatoria.";
    } else if (description.trim().length > MAX_DESCRIPTION_LENGTH) {
      nextErrors.description = `La descripción no puede superar los ${MAX_DESCRIPTION_LENGTH} caracteres.`;
    }

    if (price === "" || Number(price) <= 0) {
      nextErrors.price = "El precio tiene que ser mayor a $0.";
    }

    if (stock === "" || Number(stock) < 0) {
      nextErrors.stock = "El stock no puede ser negativo.";
    }

    return nextErrors;
  };

  // Cuando el admin elige un archivo (por click o arrastrando), lo subimos
  // enseguida (no esperamos al submit del form): pedimos la URL prefirmada
  // a nuestra función serverless (fetch, igual que en clase) y subimos la
  // imagen directo a S3. Mientras sube solo mostramos "Subiendo...", y al
  // terminar un tilde de éxito o el mensaje de error — sin barra de
  // progreso real (fetch no la expone, y para esto alcanza).
  const handleFile = async (file: File) => {
    setImageError(null);
    setImageUploaded(false);
    setIsUploadingImage(true);
    try {
      const publicUrl = await uploadProductImage(file);
      setImageUrl(publicUrl);
      setImageUploaded(true);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "No pudimos subir la imagen");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = ""; // permite volver a elegir el mismo archivo más adelante
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationErrors = validate();
    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    // Firestore no acepta `undefined` como valor de campo (tira error), así
    // que si no hay imagen, directamente no incluimos la key en vez de
    // mandarla en undefined.
    const data = {
      name: name.trim(),
      description: description.trim(),
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
      showToast(isEditing ? `"${name}" actualizado` : `"${name}" creado`);
      onSaved();
      onClose();
    } catch {
      setError("No pudimos guardar el producto. Probá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose} maxWidthClassName="max-w-3xl">
      <form onSubmit={handleSubmit} noValidate className="p-6">
        <h2 className="font-heading font-extrabold text-xl text-azul-noche mb-4">
          {isEditing ? "Editar producto" : "Nuevo producto"}
        </h2>

        {/* Imagen a la izquierda, campos a la derecha — mismo orden que el
            detalle de producto (ProductDetailPage), para que se vea "igual"
            mientras se está armando. En mobile se apila (imagen arriba). */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="text-sm font-bold text-azul-noche">
            Imagen
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`mt-1 w-full aspect-square border-2 border-dashed rounded-card flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-colors overflow-hidden ${
                isDragOver ? "border-mostaza bg-mostaza/10" : "border-gris-borde bg-crema"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />

              {isUploadingImage ? (
                <span className="text-sm font-bold text-azul-noche">Subiendo imagen...</span>
              ) : imageUrl ? (
                <>
                  <img src={imageUrl} alt="Vista previa" className="w-full h-full object-cover" />
                </>
              ) : (
                <>
                  <UploadIcon size={28} className="text-rosa-coral" />
                  <span className="text-sm font-bold text-azul-noche">Arrastrá una imagen o hacé click</span>
                  <span className="text-[11px] font-semibold text-azul-noche/40">AWS S3 · URL prefirmada</span>
                </>
              )}
            </div>
            {imageUrl && !isUploadingImage && (
              <div className="flex items-center justify-between mt-1.5">
                {imageUploaded && <span className="text-xs font-bold text-verde-texto">✓ Imagen cargada</span>}
                <span className="text-xs font-bold text-azul-cobalto ml-auto">Cambiar imagen</span>
              </div>
            )}
            {imageError && <p className="text-danger text-xs font-normal mt-1">{imageError}</p>}
          </div>

          <div className="flex flex-col gap-3">
            <FormField label="Nombre" error={fieldErrors.name}>
              <input
                value={name}
                maxLength={MAX_NAME_LENGTH}
                onChange={(e) => setName(e.target.value)}
                className={fieldInputClassName(!!fieldErrors.name)}
              />
            </FormField>

            <FormField label="Descripción" error={fieldErrors.description}>
              <textarea
                value={description}
                maxLength={MAX_DESCRIPTION_LENGTH}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={`${fieldInputClassName(!!fieldErrors.description)} resize-none`}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Precio" error={fieldErrors.price}>
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={fieldInputClassName(!!fieldErrors.price)}
                />
              </FormField>

              <FormField label="Stock" error={fieldErrors.stock}>
                <input
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className={fieldInputClassName(!!fieldErrors.stock)}
                />
              </FormField>

              <label className="text-sm font-bold text-azul-noche">
                Categoría
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value as CategoryId)}
                  className="w-full mt-1 border border-gris-borde rounded-input px-3 py-2 text-sm font-normal"
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
                  className="w-full mt-1 border border-gris-borde rounded-input px-3 py-2 text-sm font-normal"
                >
                  {MIN_AGE_OPTIONS.map((age) => (
                    <option key={age} value={age}>
                      {age}+
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        {error && <p className="text-danger text-xs mt-3">{error}</p>}

        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 text-sm font-bold text-azul-noche border border-gris-borde rounded-pill py-2"
          >
            Cancelar
          </button>
          <Button type="submit" disabled={submitting || isUploadingImage} size="form" className="flex-1">
            {submitting ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
