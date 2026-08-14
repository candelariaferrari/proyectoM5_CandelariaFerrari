import "dotenv/config";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import type { Product } from "../src/types/product.types.ts";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Los 30 productos que ya habías armado para la base de datos.
// Reutiliza el type Product real del proyecto, para que el seeder nunca
// se desalinee en silencio si el modelo cambia.
const products: Product[] = [
  {
    id: "p001",
    name: "Bloques de Construcción Arcoíris",
    description:
      "Set de bloques de madera de diferentes formas y colores para construir torres, casas y mundos imaginarios.",
    price: 22990,
    stock: 24,
    categoryId: "crear",
    minAge: 3,
    imageUrl: "/images/products/bloques-arcoiris.jpg",
    rating: { rate: 4.8, count: 128 },
  },
  {
    id: "p002",
    name: "Kit de Arte Creativo",
    description:
      "Maletín completo con lápices, marcadores, pinturas y materiales para crear ilustraciones y proyectos artísticos.",
    price: 18490,
    stock: 18,
    categoryId: "crear",
    minAge: 6,
    imageUrl: "/images/products/kit-arte.jpg",
    rating: { rate: 4.7, count: 97 },
  },
  {
    id: "p003",
    name: "Pista de Canicas Aventura",
    description:
      "Circuito modular para construir recorridos y experimentar con velocidad, gravedad y movimiento.",
    price: 27890,
    stock: 12,
    categoryId: "explorar",
    minAge: 6,
    imageUrl: "/images/products/pista-canicas.jpg",
    rating: { rate: 4.9, count: 64 },
  },
  {
    id: "p004",
    name: "Elefante de Peluche Olivia",
    description:
      "Suave elefante de peluche ideal para acompañar momentos de juego, descanso y aventuras.",
    price: 16990,
    stock: 31,
    categoryId: "compartir",
    minAge: 1,
    imageUrl: "/images/products/elefante-olivia.jpg",
    rating: { rate: 4.6, count: 89 },
  },
  {
    id: "p005",
    name: "Rompecabezas El Sistema Solar",
    description:
      "Rompecabezas ilustrado de 100 piezas para descubrir los planetas mientras se desarrolla la concentración.",
    price: 12990,
    stock: 27,
    categoryId: "pensar",
    minAge: 6,
    imageUrl: "/images/products/rompecabezas-sistema-solar.jpg",
    rating: { rate: 4.8, count: 76 },
  },
  {
    id: "p006",
    name: "Laboratorio de Ciencias Junior",
    description:
      "Kit experimental con actividades sencillas para descubrir principios básicos de ciencia y naturaleza.",
    price: 24990,
    stock: 15,
    categoryId: "explorar",
    minAge: 8,
    imageUrl: "/images/products/laboratorio-ciencias.jpg",
    rating: { rate: 4.9, count: 54 },
  },
  {
    id: "p007",
    name: "Memotest Animales del Mundo",
    description:
      "Juego de memoria con ilustraciones de animales de diferentes regiones del planeta.",
    price: 8990,
    stock: 42,
    categoryId: "pensar",
    minAge: 3,
    imageUrl: "/images/products/memotest-animales.jpg",
    rating: { rate: 4.5, count: 113 },
  },
  {
    id: "p008",
    name: "Kit de Plastilina Colores",
    description:
      "Set de plastilinas de colores con herramientas y moldes para crear personajes y figuras.",
    price: 10990,
    stock: 35,
    categoryId: "crear",
    minAge: 3,
    imageUrl: "/images/products/plastilina-colores.jpg",
    rating: { rate: 4.7, count: 91 },
  },
  {
    id: "p009",
    name: "Juego de Cartas Aventureros",
    description:
      "Juego de cartas de estrategia y aventura donde cada jugador deberá superar diferentes desafíos.",
    price: 9990,
    stock: 29,
    categoryId: "compartir",
    minAge: 8,
    imageUrl: "/images/products/cartas-aventureros.jpg",
    rating: { rate: 4.6, count: 72 },
  },
  {
    id: "p010",
    name: "Kit de Construcción Robot",
    description:
      "Set de piezas para construir diferentes modelos de robots y experimentar con mecanismos.",
    price: 31990,
    stock: 9,
    categoryId: "crear",
    minAge: 10,
    imageUrl: "/images/products/robot-construccion.jpg",
    rating: { rate: 4.9, count: 48 },
  },
  {
    id: "p011",
    name: "Juego de Mesa Isla Perdida",
    description:
      "Juego cooperativo en el que los jugadores deberán trabajar juntos para encontrar el tesoro antes de que desaparezca la isla.",
    price: 21990,
    stock: 16,
    categoryId: "compartir",
    minAge: 8,
    imageUrl: "/images/products/isla-perdida.jpg",
    rating: { rate: 4.8, count: 67 },
  },
  {
    id: "p012",
    name: "Set de Acuarelas Explorador",
    description:
      "Set artístico portátil con acuarelas, pinceles y papel para pintar donde quieras.",
    price: 8490,
    stock: 38,
    categoryId: "crear",
    minAge: 6,
    imageUrl: "/images/products/acuarelas-explorador.jpg",
    rating: { rate: 4.6, count: 83 },
  },
  {
    id: "p013",
    name: "Kit de Dinosaurios",
    description:
      "Colección de figuras de dinosaurios con tarjetas educativas para descubrir cómo vivían estas especies.",
    price: 15990,
    stock: 22,
    categoryId: "explorar",
    minAge: 6,
    imageUrl: "/images/products/kit-dinosaurios.jpg",
    rating: { rate: 4.8, count: 105 },
  },
  {
    id: "p014",
    name: "Tangram Magnético",
    description:
      "Juego de piezas magnéticas para formar figuras y resolver desafíos de diferentes niveles.",
    price: 7990,
    stock: 41,
    categoryId: "pensar",
    minAge: 6,
    imageUrl: "/images/products/tangram-magnetico.jpg",
    rating: { rate: 4.7, count: 59 },
  },
  {
    id: "p015",
    name: "Set de Cocina Mini Chef",
    description:
      "Juego de cocina con utensilios y accesorios para inventar recetas y jugar a ser chef.",
    price: 19990,
    stock: 14,
    categoryId: "compartir",
    minAge: 3,
    imageUrl: "/images/products/mini-chef.jpg",
    rating: { rate: 4.5, count: 81 },
  },
  {
    id: "p016",
    name: "Microscopio Explorador",
    description:
      "Microscopio infantil para observar pequeños objetos y comenzar a explorar el mundo de la ciencia.",
    price: 28990,
    stock: 8,
    categoryId: "explorar",
    minAge: 10,
    imageUrl: "/images/products/microscopio.jpg",
    rating: { rate: 4.9, count: 36 },
  },
  {
    id: "p017",
    name: "Diario Secreto Creativo",
    description:
      "Cuaderno interactivo con actividades, desafíos de dibujo y páginas para escribir historias.",
    price: 7490,
    stock: 45,
    categoryId: "crear",
    minAge: 8,
    imageUrl: "/images/products/diario-secreto.jpg",
    rating: { rate: 4.6, count: 92 },
  },
  {
    id: "p018",
    name: "Ajedrez Junior",
    description:
      "Versión especialmente diseñada para aprender los movimientos y estrategias básicas del ajedrez.",
    price: 13990,
    stock: 19,
    categoryId: "pensar",
    minAge: 8,
    imageUrl: "/images/products/ajedrez-junior.jpg",
    rating: { rate: 4.8, count: 61 },
  },
  {
    id: "p019",
    name: "Kit de Huerta en Casa",
    description:
      "Kit educativo para plantar, cuidar y observar el crecimiento de pequeñas plantas.",
    price: 11990,
    stock: 26,
    categoryId: "explorar",
    minAge: 6,
    imageUrl: "/images/products/huerta-casa.jpg",
    rating: { rate: 4.7, count: 74 },
  },
  {
    id: "p020",
    name: "Teatro de Títeres",
    description:
      "Pequeño teatro portátil con títeres para inventar historias y representarlas en familia.",
    price: 24990,
    stock: 11,
    categoryId: "compartir",
    minAge: 3,
    imageUrl: "/images/products/teatro-titeres.jpg",
    rating: { rate: 4.9, count: 43 },
  },
  {
    id: "p021",
    name: "Laberinto de Ingenio",
    description:
      "Desafío de lógica en el que hay que encontrar el camino correcto utilizando concentración y estrategia.",
    price: 9490,
    stock: 33,
    categoryId: "pensar",
    minAge: 6,
    imageUrl: "/images/products/laberinto-ingenio.jpg",
    rating: { rate: 4.6, count: 88 },
  },
  {
    id: "p022",
    name: "Set de Pulseras Creativas",
    description:
      "Kit con cuentas de colores, hilos y accesorios para diseñar pulseras y pequeños regalos.",
    price: 8990,
    stock: 37,
    categoryId: "crear",
    minAge: 8,
    imageUrl: "/images/products/pulseras-creativas.jpg",
    rating: { rate: 4.7, count: 69 },
  },
  {
    id: "p023",
    name: "Búsqueda del Tesoro",
    description:
      "Juego de pistas y desafíos para organizar una búsqueda del tesoro dentro o fuera de casa.",
    price: 11490,
    stock: 21,
    categoryId: "compartir",
    minAge: 6,
    imageUrl: "/images/products/busqueda-tesoro.jpg",
    rating: { rate: 4.8, count: 52 },
  },
  {
    id: "p024",
    name: "Kit de Volcanes",
    description:
      "Experimento educativo para crear un volcán y observar reacciones químicas de forma segura.",
    price: 13990,
    stock: 17,
    categoryId: "explorar",
    minAge: 8,
    imageUrl: "/images/products/kit-volcan.jpg",
    rating: { rate: 4.8, count: 47 },
  },
  {
    id: "p025",
    name: "Sudoku Infantil",
    description:
      "Cuaderno de desafíos de lógica con distintos niveles para desarrollar concentración y razonamiento.",
    price: 6490,
    stock: 48,
    categoryId: "pensar",
    minAge: 8,
    imageUrl: "/images/products/sudoku-infantil.jpg",
    rating: { rate: 4.5, count: 57 },
  },
  {
    id: "p026",
    name: "Pista de Autos Magnética",
    description:
      "Circuito modular con piezas magnéticas para crear recorridos y carreras diferentes en cada partida.",
    price: 22990,
    stock: 13,
    categoryId: "explorar",
    minAge: 6,
    imageUrl: "/images/products/pista-autos.jpg",
    rating: { rate: 4.7, count: 63 },
  },
  {
    id: "p027",
    name: "Set de Construcción Magnético",
    description:
      "Piezas magnéticas de diferentes formas para construir estructuras, animales y figuras geométricas.",
    price: 26990,
    stock: 20,
    categoryId: "crear",
    minAge: 6,
    imageUrl: "/images/products/construccion-magnetica.jpg",
    rating: { rate: 4.9, count: 118 },
  },
  {
    id: "p028",
    name: "Juego Cooperativo La Gran Expedición",
    description:
      "Aventura cooperativa donde todos los jugadores deben superar desafíos para completar una expedición.",
    price: 23990,
    stock: 10,
    categoryId: "compartir",
    minAge: 10,
    imageUrl: "/images/products/gran-expedicion.jpg",
    rating: { rate: 4.8, count: 44 },
  },
  {
    id: "p029",
    name: "Kit de Astronomía Junior",
    description:
      "Set para descubrir constelaciones, planetas y curiosidades del espacio mediante actividades educativas.",
    price: 29990,
    stock: 7,
    categoryId: "explorar",
    minAge: 12,
    imageUrl: "/images/products/astronomia-junior.jpg",
    rating: { rate: 4.9, count: 39 },
  },
  {
    id: "p030",
    name: "Desafío Escape Room Junior",
    description:
      "Juego de enigmas y acertijos para resolver en equipo y escapar antes de que termine el tiempo.",
    price: 18990,
    stock: 14,
    categoryId: "pensar",
    minAge: 10,
    imageUrl: "/images/products/escape-room-junior.jpg",
    rating: { rate: 4.8, count: 71 },
  },
];

async function seed() {
  console.log(`🌱 Sembrando ${products.length} productos...\n`);

  for (const { id, ...data } of products) {
    // Documento con ID fijo (el "p001" del array), no autogenerado:
    // así los IDs quedan estables y predecibles entre corridas del seeder.
    const ref = doc(db, "products", id);
    await setDoc(ref, {
      ...data,
      nameLower: data.name.toLowerCase(), // para búsqueda por prefijo (L4)
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log(`✔ ${data.name}`);
  }

  console.log(`\n✅ ${products.length} productos creados correctamente.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Error al ejecutar el seeder:");
  console.error(error);
  process.exit(1);
});
