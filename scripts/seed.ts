import "dotenv/config";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Product } from "../src/types/product.types.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Mismo bucket y credenciales que usa api/presign.ts, pero acá no hace
// falta URL prefirmada: el seeder corre en Node (nunca en el navegador),
// así que puede usar las credenciales de AWS directamente.
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME as string;
const IMAGES_DIR = join(__dirname, "../src/assets/products");

// Sube las imágenes locales a S3 y devuelve, en orden, la URL pública de
// cada una. Los nombres de archivo vienen numerados (01_..., 02_..., etc.)
// para que el orden coincida con el orden de `products` más abajo.
async function uploadLocalImages(): Promise<string[]> {
  const files = readdirSync(IMAGES_DIR).sort();
  const urls: string[] = [];

  for (const filename of files) {
    const key = `imgProducts/${filename}`;
    const body = readFileSync(join(IMAGES_DIR, filename));
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: body,
        ContentType: "image/png",
      })
    );
    urls.push(`https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`);
    console.log(`  📷 subida: ${filename}`);
  }

  return urls;
}

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
const auth = getAuth(app);

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
    rating: { rate: 4.8, count: 71 },
  },
  {
    id: "p031",
    name: "Torre de Equilibrio Bambú",
    description:
      "Juego de destreza y pulso firme: hay que ir sacando y apilando piezas de bambú sin que la torre se caiga.",
    price: 9990,
    stock: 40,
    categoryId: "pensar",
    minAge: 6,
    rating: { rate: 4.7, count: 68 },
  },
  {
    id: "p032",
    name: "Dominó de Formas y Colores",
    description:
      "Versión de dominó pensada para los más chicos, con formas y colores en vez de números.",
    price: 6990,
    stock: 50,
    categoryId: "pensar",
    minAge: 3,
    rating: { rate: 4.6, count: 54 },
  },
  {
    id: "p033",
    name: "Rompecabezas 3D Castillo Encantado",
    description:
      "Armá un castillo tridimensional pieza por pieza, ideal para desarrollar paciencia y coordinación.",
    price: 16990,
    stock: 20,
    categoryId: "pensar",
    minAge: 8,
    rating: { rate: 4.8, count: 47 },
  },
  {
    id: "p034",
    name: "Juego de Lógica Torres de Hanoi",
    description:
      "El clásico rompecabezas matemático: mover todos los discos de una torre a otra siguiendo las reglas.",
    price: 8490,
    stock: 33,
    categoryId: "pensar",
    minAge: 8,
    rating: { rate: 4.8, count: 61 },
  },
  {
    id: "p035",
    name: "Cubo Mágico Clásico",
    description:
      "El rompecabezas de rotación más famoso del mundo, para entrenar la memoria y la resolución de patrones.",
    price: 5990,
    stock: 55,
    categoryId: "pensar",
    minAge: 8,
    rating: { rate: 4.7, count: 132 },
  },
  {
    id: "p036",
    name: "Batalla Naval de Viaje",
    description:
      "Versión compacta y plegable del clásico juego de estrategia naval, ideal para llevar a cualquier lado.",
    price: 7490,
    stock: 28,
    categoryId: "pensar",
    minAge: 6,
    rating: { rate: 4.5, count: 49 },
  },
  {
    id: "p037",
    name: "Set de Enigmas Detectivescos",
    description:
      "Caja de casos y pistas para resolver misterios paso a paso, pensando como un verdadero detective.",
    price: 12990,
    stock: 18,
    categoryId: "pensar",
    minAge: 10,
    rating: { rate: 4.9, count: 41 },
  },
  {
    id: "p038",
    name: "Bingo Numérico Familiar",
    description:
      "Juego de bingo con cartones y fichas de colores, pensado para jugar en familia desde varias edades.",
    price: 8990,
    stock: 30,
    categoryId: "pensar",
    minAge: 6,
    rating: { rate: 4.6, count: 58 },
  },
  {
    id: "p039",
    name: "Kit de Origami Ilustrado",
    description:
      "Papeles de colores y guía ilustrada paso a paso para aprender a plegar figuras de origami.",
    price: 6490,
    stock: 40,
    categoryId: "crear",
    minAge: 6,
    rating: { rate: 4.6, count: 52 },
  },
  {
    id: "p040",
    name: "Set de Sellos y Estampas",
    description:
      "Sellos de goma con diseños variados y almohadillas de tinta de colores para decorar tarjetas y dibujos.",
    price: 8990,
    stock: 35,
    categoryId: "crear",
    minAge: 3,
    rating: { rate: 4.5, count: 63 },
  },
  {
    id: "p041",
    name: "Caballete Infantil de Madera",
    description:
      "Caballete doble faz (pizarra y para pintar) de madera, ajustable en altura para acompañar el crecimiento.",
    price: 24990,
    stock: 10,
    categoryId: "crear",
    minAge: 3,
    rating: { rate: 4.9, count: 37 },
  },
  {
    id: "p042",
    name: "Kit de Velas Aromáticas Junior",
    description:
      "Set seguro para derretir cera y armar velas con aromas y colores propios, con supervisión de un adulto.",
    price: 13990,
    stock: 15,
    categoryId: "crear",
    minAge: 10,
    rating: { rate: 4.7, count: 29 },
  },
  {
    id: "p043",
    name: "Set de Mosaicos Brillantes",
    description:
      "Piezas de mosaico autoadhesivas para armar láminas ilustradas con texturas y brillo.",
    price: 10990,
    stock: 25,
    categoryId: "crear",
    minAge: 6,
    rating: { rate: 4.6, count: 55 },
  },
  {
    id: "p044",
    name: "Bordado Fácil para Principiantes",
    description:
      "Kit inicial de bordado con aro, hilos de colores y láminas con diseño para calcar y coser.",
    price: 9490,
    stock: 22,
    categoryId: "crear",
    minAge: 8,
    rating: { rate: 4.7, count: 34 },
  },
  {
    id: "p045",
    name: "Kit de Slime Casero",
    description:
      "Todo lo necesario para preparar slime en casa de distintas texturas y colores, de forma segura.",
    price: 7990,
    stock: 45,
    categoryId: "crear",
    minAge: 6,
    rating: { rate: 4.8, count: 97 },
  },
  {
    id: "p046",
    name: "Juego de Mesa Carrera Loca",
    description:
      "Juego de tablero con obstáculos y sorpresas para correr en familia hasta llegar primero a la meta.",
    price: 17990,
    stock: 20,
    categoryId: "compartir",
    minAge: 6,
    rating: { rate: 4.7, count: 66 },
  },
  {
    id: "p047",
    name: "Twister Divertido",
    description:
      "El clásico juego de equilibrio y risas: manos y pies sobre los círculos de colores sin caerse.",
    price: 14990,
    stock: 16,
    categoryId: "compartir",
    minAge: 6,
    rating: { rate: 4.8, count: 84 },
  },
  {
    id: "p048",
    name: "Set de Karaoke Junior",
    description:
      "Micrófono con parlante y luces para cantar en familia, con entrada para conectar el celular.",
    price: 26990,
    stock: 9,
    categoryId: "compartir",
    minAge: 6,
    rating: { rate: 4.6, count: 45 },
  },
  {
    id: "p049",
    name: "Juego de Cartas Uno Clásico",
    description:
      "El juego de cartas más jugado del mundo, ideal para partidas rápidas con toda la familia.",
    price: 6990,
    stock: 60,
    categoryId: "compartir",
    minAge: 6,
    rating: { rate: 4.9, count: 141 },
  },
  {
    id: "p050",
    name: "Bolos Inflables de Jardín",
    description:
      "Set de bolos inflables gigantes con pelota, para jugar al aire libre en el jardín o la plaza.",
    price: 15990,
    stock: 14,
    categoryId: "compartir",
    minAge: 3,
    rating: { rate: 4.5, count: 38 },
  },
  {
    id: "p051",
    name: "Juego Cooperativo El Zoológico Perdido",
    description:
      "Todos los jugadores trabajan juntos para encontrar a los animales antes de que se termine el tiempo.",
    price: 19990,
    stock: 12,
    categoryId: "compartir",
    minAge: 8,
    rating: { rate: 4.8, count: 42 },
  },
  {
    id: "p052",
    name: "Set de Disfraces Superhéroes",
    description:
      "Capa, máscara y accesorios para jugar a ser superhéroe en casa o con amigos.",
    price: 21990,
    stock: 11,
    categoryId: "compartir",
    minAge: 3,
    rating: { rate: 4.7, count: 59 },
  },
  {
    id: "p053",
    name: "Piñata para Armar y Decorar",
    description:
      "Piñata de cartón lista para decorar y rellenar, ideal para cumpleaños y celebraciones en grupo.",
    price: 8990,
    stock: 24,
    categoryId: "compartir",
    minAge: 3,
    rating: { rate: 4.6, count: 31 },
  },
  {
    id: "p054",
    name: "Kit de Exploración Selva",
    description:
      "Set de aventurero con lupa, brújula y linterna para salir a explorar el patio o la plaza.",
    price: 18990,
    stock: 17,
    categoryId: "explorar",
    minAge: 6,
    rating: { rate: 4.8, count: 53 },
  },
  {
    id: "p055",
    name: "Binoculares para Niños",
    description:
      "Binoculares livianos y resistentes, ideales para observar aves, paisajes y animales de lejos.",
    price: 11990,
    stock: 26,
    categoryId: "explorar",
    minAge: 6,
    rating: { rate: 4.7, count: 48 },
  },
  {
    id: "p056",
    name: "Set de Jardinería Infantil",
    description:
      "Herramientas de jardinería a escala infantil, guantes y maceta para empezar a cultivar plantas propias.",
    price: 9990,
    stock: 32,
    categoryId: "explorar",
    minAge: 6,
    rating: { rate: 4.6, count: 44 },
  },
  {
    id: "p057",
    name: "Cometa Voladora Colorida",
    description:
      "Cometa liviana y fácil de armar, lista para volar en días de viento con toda la familia.",
    price: 7490,
    stock: 38,
    categoryId: "explorar",
    minAge: 6,
    rating: { rate: 4.5, count: 62 },
  },
  {
    id: "p058",
    name: "Kit de Campamento Junior",
    description:
      "Carpa pequeña, linterna y accesorios para armar un campamento en el living o en el patio.",
    price: 23990,
    stock: 8,
    categoryId: "explorar",
    minAge: 8,
    rating: { rate: 4.9, count: 33 },
  },
  {
    id: "p059",
    name: "Brújula y Mapa de Aventuras",
    description:
      "Brújula real junto con un mapa ilustrado para diseñar recorridos y buscar tesoros escondidos.",
    price: 6990,
    stock: 41,
    categoryId: "explorar",
    minAge: 8,
    rating: { rate: 4.6, count: 36 },
  },
  {
    id: "p060",
    name: "Set de Insectos para Observar",
    description:
      "Terrario portátil con lupa incorporada para observar de cerca insectos de forma segura y devolverlos después.",
    price: 12490,
    stock: 19,
    categoryId: "explorar",
    minAge: 6,
    rating: { rate: 4.7, count: 27 },
  },
];

async function seed() {
  // Las reglas de Firestore (firestore.rules) solo dejan crear/editar
  // productos a un usuario logueado con rol "admin" -- el seeder corre
  // como Node script, sin sesión propia, así que nos logueamos primero
  // con las credenciales de un admin real antes de escribir nada.
  console.log(`🔐 Iniciando sesión como admin...`);
  await signInWithEmailAndPassword(
    auth,
    process.env.SEED_ADMIN_EMAIL as string,
    process.env.SEED_ADMIN_PASSWORD as string
  );

  console.log(`📤 Subiendo imágenes a S3...`);
  const imageUrls = await uploadLocalImages();
  console.log(`✅ ${imageUrls.length} imágenes subidas.\n`);

  console.log(`🌱 Sembrando ${products.length} productos...\n`);

  for (const [index, { id, ...data }] of products.entries()) {
    // Solo los primeros N productos tienen imagen real (tantos como
    // archivos haya en src/assets/products). El resto queda sin
    // `imageUrl`: ProductImage muestra un cuadrado de color de su
    // categoría en vez de un ícono de imagen rota.
    const imageUrl = imageUrls[index];

    // Documento con ID fijo (el "p001" del array), no autogenerado:
    // así los IDs quedan estables y predecibles entre corridas del seeder.
    const ref = doc(db, "products", id);
    await setDoc(ref, {
      ...data,
      ...(imageUrl ? { imageUrl } : {}),
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
