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

- height de body que siempre ocupe el 100% o el calculo para que el footer siempre quede en el bottom 
- quitar orferta de navbar , ya que no se usa y que mis pedidos este deshabilitado si no se esta logueado
- en el modal de incio en vez de hola de nuevo, me gustaría algo como "Bienvenido a MUNDO" (ese mundo que sea el del logo) y en el register en vez de bienvenido que sea Registrarte en Mundo y en vez de incia sesion para seguir comprando que diga , inica sesión para descrubir un mundo de juegos! 
- En Products me gustaria que se genere un scroll para el grid de los products pero que el scroll no sea de toda la pantalla no se si me explico o sea que ese grid este dentro de otro div que contenga no se heigth 95% y ese genere el scroll asi se ve siempre el footer y la paginación de los productos
-  En products también falta generar algun hover a cada card de producto 
- en producto del detalle , me gustaria que la imagen se vea un poco mas chica y por mas que tenga el nav con los link que tenga un icono de x en la esquina superir derecha para cerrar el detalle 
- en carrito tambien que la lista de productos este dentro de un div que tenga el height necesario para que se vea el footer en pantalla y el scroll de los productos se genere ahí adentro. 
- a todos los border tal vez hacer un gris un poquitito mas oscuro porque casi ni veo yo los bordes 
- En general que footer siempre quede en bottom del 100wh de la pantalla
- En el navbar el icono de "persona" me gustaria que cuando uno inicia sesion se convierta en un icono de logout , NO que aparezaca el "cerrar sesion" y el "hola" 
- En el navbar generar un hover y active para los links 
- en mobile tal vez generarle alguna animación al drop down y top del resumen del pedido del carrito
- en mobile sacar el carrito del header ya que aparece en el bottom Nav y haciendo eso creo que queda lugar para que el buscar se abra en una misma linea o sea que ese mismo icono de buscar se convierta en el buscador 
- en mobile mismo criterio para el icono de usuario se convierta en logout

- [ ] test revisar lo que falta testear, con la lectura y la guia del proyecto
- [ ] Correr `npm run lint` y `npm run test:run` una vez más antes de la entrega
- [ ] redactar readme completo, con img o gif 
- [ ] crear presentación en slide para la defensa oral 
- [ ] practicar preguntas y respuestas o tipo multiplechois referedio a los temas del modulo y al proyecto



- Rating "decorativo": el campo rating de Product existe y se muestra, pero nadie puede calificar un producto desde la UI. No es el extra credit de "Reviews y Ratings" — no lo presentes como tal en la defensa.
- ProtectedRoute unificado: la guía sugiere dos componentes separados (uno para sesión activa, otro para admin). Vos resolviste ambos casos en un solo componente con la prop adminOnly. Funciona perfecto y está bien razonado, pero tené la justificación lista si te preguntan por qué no los separaste.

