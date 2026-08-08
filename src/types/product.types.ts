export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string; // La imagen se va a alojar en AWS S3, por eso es una URL y no un archivo local.
  rating: {
    rate: number;
    count: number;
  };
};
