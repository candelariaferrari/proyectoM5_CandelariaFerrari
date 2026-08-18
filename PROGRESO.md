# Progreso del proyecto

## Catálogo y producto

- [x] Home / listado de productos con filtros
- [x] Página de detalle de producto

## Carrito

- [x] Agregar / quitar / actualizar cantidad
- [x] Fix de overflow horizontal en mobile
- [x] Carrito de invitado se fusiona con el del usuario al loguearse
- [x] Botón de checkout gateado por login (con modal para loguearse)

## Autenticación

- [x] Login / registro
- [x] Rutas protegidas (cliente y admin)

## Panel de administración

- [x] Layout, navegación y rutas protegidas (`adminOnly`)
- [x] CRUD de productos (crear, editar, eliminar)
- [x] Dashboard con métricas reales (productos, usuarios)
- [x] Vista de órdenes (placeholder, todavía sin pedidos reales)
- [x] Ajustes visuales según mockups (mobile y desktop)

## Imágenes de producto (S3)

- [x] Función serverless para URLs prefirmadas (`api/presign.ts`)
- [x] Servicio de subida directa a S3 desde el form (`upload.services.ts`)
- [x] Bucket, política, CORS e IAM configurados en AWS
- [x] Deploy inicial a Vercel (para probar la función real)
- [x] Ampliar seeder de 30 a 60 productos

## listo
- [x] La barra de envío gratis no cambia a verde al alcanzar el monto.
- [x] Al buscador le falta la cruz para limpiar la búsqueda.
- [x]Bug real: un producto encontrado por búsqueda no abre su detalle, pero el mismo producto sí abre si lo seleccionás sin buscar (probablemente algo en cómo se arma el link/id del resultado de búsqueda).
- [x] paginación en productos (custemer y admin) y en ordenes/pedidos
- [x] Mosaico de categorías se desborda en mobile en /productos (mismo tipo de bug que ya arreglamos en el carrito).
- [x] Falta el ítem "Juguetes" en el BottomTabBar — sin eso no se puede llegar a productos desde el nav de abajo.
- [x] Revisar cambio suelto en `HomePage.tsx` (comentario, sin commitear)
- [x] En el carrito: que el bloque de compra se pueda colapsar/expandir para ver la lista completa de productos.
- [X] footer
- [X] Crear toas para todos las acciones, se agrego al carrito, se elimino del carrito, se creo producto exitosamente, se guardo producto exitosamente, se elimino producto , confirmación de compra, error de compra, 
- [X] validaciones de formularios, lineas en rojo de lo que es obligatorio, que se puede y que no se puede , (el input no se puede hacer como un layout o ui ya que se utiliza en varios lugares)
- [x] Flujo de checkout (crear orden real al comprar)
- [x] Gestión real de órdenes en el admin (ahora es un placeholder)
- [x] chequear si no hace falta hacer una restructuración de carpetas y de codigo. Ej btn que vimos en clase 
- [x] Mensajes de error de Firebase Auth: AuthModal muestra un mensaje genérico ("No pudimos iniciar sesión") en vez de traducir el código específico de Firebase (auth/email-already-in-use, etc.), como sugiere la guía. No es un error, pero es una mejora fácil si te queda tiempo.
- [x] AdminDashboardPage: el conteo de usuarios trae todos los documentos de la colección users solo para contar cuántos son (getUser().length), en vez de usar getCountFromServer() como sí hiciste con productos. A esta escala no importa, pero es una inconsistencia menor de criterio.
- [x] - TypeScript: falta "strict": true explícito
No encontré ningún uso de `any` en todo el código — buena señal de disciplina. Pero tsconfig.app.json no tiene "strict": true, así que el compilador no está exigiendo strictNullChecks ni noImplicitAny por configuración explícita. Es una mejora rápida y de alto impacto para el criterio "TypeScript avanzado": agregalo y corregí lo que el compilador señale (probablemente poco, dado el estilo del resto del código).

## Pendiente
para mobile:

- generarle alguna animación al drop down y top del resumen del pedido del carrito
- sacar el carrito del header ya que aparece en el bottom Nav y haciendo eso que queda lugar para que el buscar se abra en una misma linea o sea que ese mismo icono de buscar se convierta en el buscador 
- mismo criterio para el icono de usuario se convierta en logout
- sacar footer en mobile

- [ ] test revisar lo que falta testear, con la lectura y la guia del proyecto
- [ ] Correr `npm run lint` y `npm run test:run` una vez más antes de la entrega
- [ ] redactar readme completo, con img o gif 
- [ ] crear presentación en slide para la defensa oral 
- [ ] practicar preguntas y respuestas o tipo multiplechois referedio a los temas del modulo y al proyecto



- Rating "decorativo": el campo rating de Product existe y se muestra, pero nadie puede calificar un producto desde la UI. No es el extra credit de "Reviews y Ratings" — no lo presentes como tal en la defensa.


Puedo armar preguntas tipo múltiple choice o de defensa oral basadas en tu proyecto y en los temas del módulo (Context API vs Redux, presigned URLs, reglas de Firestore, etc.), hacerte de "jurado" simulando la defensa, o repasar algún tema puntual que sientas más flojo
¿Arrancamos con el estudio para la defensa? Cualquier cosa, decime cómo te gustaría encararlo: que te tire preguntas tipo banca de examen, que repasemos juntos las decisiones técnicas del proyecto, o algo puntual que te preocupe más.