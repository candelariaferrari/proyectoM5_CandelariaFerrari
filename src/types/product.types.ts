export type CategoryId = "pensar" | "crear" | "compartir" | "explorar";
export type MinAge = 1 | 3 | 6 | 8 | 10 | 12;

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: CategoryId;
  minAge: MinAge;
  imageUrl?: string;
  rating: { rate: number; count: number };
};