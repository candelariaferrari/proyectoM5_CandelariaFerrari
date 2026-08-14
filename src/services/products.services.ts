import { collection, getDocs, doc, getDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";
import type { Product } from "../types/product.types";

// Obtener todos los productos
export const getProducts = async (): Promise<Product[]> => { //funcion asyncrona porque pedimos algo que esta por fuera 
  const snapshot = await getDocs(collection(db, "products")); //funcion de sdk firestore que trae colecciton de la base de datos de products
  return snapshot.docs.map((doc)=>({ // snapshot.docs es una array donde estan todos los docs
    id: doc.id, //porque el id esta por fuera del doc
    ...doc.data() //el resto de la info de cada objeto del doc
  } as Product));
};
//snapshot: { docs: [{id, name, ...}]}

//obtener un producto por id: 
export const getProductsById = async (
  id: string
): Promise<Product | null> => {
  const ref = doc(db, "products", id);
  const snapshot = await getDoc(ref);

  if(!snapshot.exists()) return null;

  return{
    id: snapshot.id,
    ...snapshot.data()
  } as Product;
}

// Obtener productos por categoria ordenados por precio: 
export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  const q = query(
    collection(db, "products"), //trae toda la coleection
    where("categoryId", "==", category), //filtra por categoria
    orderBy ("price", "asc") // los ordena por precio ascendente
  );
  const snapshot = await getDocs(q); //traeme los doc segun la q 

  return snapshot.docs.map((doc)=>({ 
    id: doc.id, //agrega el id del doc
    ...doc.data()//el doc
  } as Product));
};