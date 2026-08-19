## Definición de la estructura de carpetas del proyecto

### Contexto técnico

Al comenzar el proyecto necesitaba definir una estructura de carpetas que fuera fácil de mantener y entender a medida que la aplicación creciera.

Estaba considerando dos alternativas de organización:

* **Layer-based:** organizar el código según el tipo de responsabilidad, por ejemplo `components`, `pages`, `hooks`, `services`, `types` y `utils`.
* **Feature-based:** organizarlo según las funcionalidades o dominios de la aplicación, agrupando dentro de cada feature sus propios componentes, hooks y servicios.

Como se trata de un proyecto que todavía estoy aprendiendo a estructurar y mantener, quería evaluar cuál de las dos alternativas sería más conveniente.

### Prompt

> Estoy comenzando un proyecto con React y estoy pensando en utilizar una estructura Layer-based, organizando `src` de la siguiente manera:
>
> ```text
> src/
>   components/
>     ui/
>     layout/
>   pages/
>   hooks/
>   services/
>   types/
>   utils/
>   router/
> ```
>
> También estoy considerando utilizar una estructura Feature-based, organizando el código por funcionalidades o dominios.
>
> ¿Cuál de las dos alternativas considerás más adecuada para este proyecto?
>
> Compará las ventajas y desventajas de cada enfoque teniendo en cuenta la facilidad de mantenimiento, la relación entre componentes, hooks y servicios, y las posibles dependencias entre funcionalidades.

### Qué decidí

Después de comparar ambas alternativas, decidí comenzar utilizando una estructura **Layer-based**.

La principal razón fue que, en esta etapa del proyecto, considero que esta organización me permite entender mejor cómo se relacionan las distintas partes de la aplicación y dónde debe ubicarse cada responsabilidad.

También tuve en cuenta que una estructura Feature-based puede generar dependencias entre funcionalidades. Por ejemplo, una funcionalidad como `Cart` podría necesitar acceder a información relacionada con `Auth` o `Products`, generando dependencias cruzadas entre features.

Esta decisión no es definitiva. A medida que el proyecto crezca y aumente la cantidad de archivos y funcionalidades, voy a reevaluar la estructura y considerar una migración a un enfoque Feature-based si resulta más conveniente.

La decisión final fue mía a partir de analizar las ventajas y desventajas de ambos enfoques; utilicé la IA como herramienta para comparar alternativas antes de elegir.


## Definición de convenciones de nombres

### Contexto técnico

Una vez definida inicialmente una estructura de carpetas **Layer-based**, necesitaba establecer una convención consistente para nombrar carpetas y archivos del proyecto.

La idea era definir criterios claros para componentes, contextos, hooks, servicios y tipos, de manera que la estructura fuera predecible y facilitara la lectura y el mantenimiento del código.

Para tomar esta decisión evalué dos alternativas de nomenclatura y organización.

### Prompt

> Quiero definir una buena convención de nombres para las carpetas y archivos del proyecto.
>
> Necesito establecer criterios para nombrar:
>
> * componentes;
> * contextos;
> * hooks;
> * servicios;
> * tipos.
>
> Proponeme dos alternativas de convención y explicá las ventajas y desventajas de cada una, teniendo en cuenta la estructura Layer-based que decidimos utilizar y la posibilidad de que el proyecto crezca en el futuro.

### Alternativas analizadas

**Opción 1 — Convención por tipo con sufijos**

Utilizar el nombre del archivo para identificar también su responsabilidad:

```text
components/ProductCard.tsx
contexts/AuthContext.tsx
hooks/useAuth.ts
services/authService.ts
types/product.types.ts
```

Esta alternativa permite identificar rápidamente qué representa cada archivo. Por ejemplo, `use...` indica un hook, `...Context` un contexto y `...Service` un servicio.

**Ventajas:**

* Convención simple y predecible.
* Facilita encontrar archivos y comprender su responsabilidad.
* Es una nomenclatura ampliamente utilizada en proyectos React.
* El nombre del archivo aporta información incluso cuando se lo consulta fuera de su carpeta.

**Desventajas:**

* Algunos sufijos pueden resultar redundantes cuando la carpeta ya indica el tipo.
* Si el proyecto crece mucho, los archivos relacionados con una misma funcionalidad pueden quedar distribuidos entre distintas carpetas.

---

**Opción 2 — Organización por dominio dentro de cada capa**

Agrupar los archivos relacionados con un mismo dominio dentro de subcarpetas, utilizando además archivos `index.ts` para exponer los elementos públicos:

```text
contexts/
  auth/
    AuthContext.tsx
    useAuth.ts
    auth.types.ts
    index.ts
  cart/
    CartContext.tsx
    useCart.ts
    index.ts
```

Esta alternativa facilita el encapsulamiento de cada dominio y podría facilitar una futura migración hacia una estructura Feature-based.

**Ventajas:**

* Mayor agrupación por dominio.
* Imports potencialmente más limpios mediante `index.ts`.
* Facilita una futura migración hacia una estructura Feature-based.

**Desventajas:**

* Para el tamaño actual del proyecto puede agregar complejidad innecesaria.
* Introduce más carpetas y archivos `index.ts`.
* Los barrel files pueden generar problemas de imports circulares si no se utilizan correctamente.

### Qué decidí

Decidí utilizar la **Opción 1: convención por tipo con sufijos**.

La principal razón fue que el proyecto ya cuenta con una separación clara mediante carpetas como `components`, `hooks`, `contexts`, `services` y `types`. Por lo tanto, consideré que agregar una organización por dominio dentro de cada capa sería innecesario para el tamaño y complejidad actual del proyecto.

Además, la primera alternativa me permite mantener una convención simple y predecible: el nombre del archivo identifica tanto su responsabilidad como, cuando corresponde, el patrón que representa (`useAuth`, `AuthContext`, `authService`, etc.).

Al igual que con la decisión sobre la estructura de carpetas, esta convención podrá ser revisada si el proyecto crece y la organización actual deja de resultar adecuada.


## Definición de la convención para los commits

### Contexto técnico

Al comenzar el desarrollo del proyecto quería establecer una convención para nombrar los commits desde el inicio, con el objetivo de mantener un historial claro, ordenado y fácil de revisar a medida que el proyecto crezca.

Antes de definirla, quise comparar distintas alternativas y entender qué ventajas ofrecía cada una.

### Prompt

> Quiero definir una convención para nombrar los commits del proyecto.
>
> ¿Qué opciones existen y cuáles son las mejores prácticas para mantener un historial claro y profesional?
>
> Compará al menos dos alternativas, explicando sus ventajas y desventajas, y teniendo en cuenta que el proyecto va a seguir creciendo y sumando funcionalidades.

### Alternativas analizadas

**Opción 1 — Conventional Commits**

Utilizar un formato basado en un tipo de cambio seguido de una descripción:

```text
tipo(scope opcional): descripción
```

Por ejemplo:

```text
feat(cart): agregar guard a useCart
fix(auth): corregir logout
docs(readme): agregar bitácora de IA
```

Entre los tipos más utilizados se encuentran `feat`, `fix`, `docs`, `test`, `refactor`, `style`, `chore`, `perf`, `build` y `ci`.

**Ventajas:**

* Es una convención ampliamente utilizada en proyectos profesionales.
* Permite identificar rápidamente el tipo de cambio realizado.
* Facilita la lectura y revisión del historial.
* Es compatible con herramientas que pueden interpretar los tipos de commit y generar changelogs.

**Desventajas:**

* Requiere cierta consistencia para decidir qué tipo corresponde a cada cambio.
* Para modificaciones muy pequeñas puede resultar más estructurado de lo necesario.

---

**Opción 2 — Mensajes en imperativo simple**

Utilizar únicamente una descripción breve del cambio, sin categorías:

```text
Add ProductCard component
Fix cart guard
Update README
```

**Ventajas:**

* Es simple y rápido de utilizar.
* No requiere decidir entre diferentes tipos de cambio.
* Mantiene los mensajes fáciles de leer.

**Desventajas:**

* No permite identificar rápidamente si se trata de una funcionalidad, corrección, test, documentación, etc.
* Resulta menos útil para automatizaciones y herramientas que utilizan la información del commit.
* A medida que el proyecto crezca, puede resultar más difícil mantener una clasificación consistente.

### Qué decidí

Decidí utilizar **Conventional Commits** porque considero que es una buena práctica para mantener un historial organizado y porque me permite incorporar desde este proyecto una convención utilizada en entornos profesionales.

Voy a utilizar prefijos como `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `style:` y `chore:` según corresponda.

Como criterio personal, además, decidí que la descripción del commit no sea excesivamente corta. Aunque mantendré el formato de Conventional Commits, la descripción tendrá el suficiente nivel de detalle como para entender qué se modificó sin necesidad de revisar inmediatamente el código.

Esta convención podrá ajustarse si las necesidades del proyecto cambian a medida que avance el desarrollo.


4)
## Revisión del modelo de datos

### Contexto técnico

Antes de avanzar con la implementación de funcionalidades, quería validar que los tipos de TypeScript fueran adecuados para el modelo de datos del proyecto y para futuras integraciones con Firebase.

### Prompt

> Revisá mi modelo de datos y proponeme mejoras. Explicame brevemente el motivo de cada cambio y tené en cuenta que más adelante voy a integrar Firebase.
>
> ```ts
> export type CartItem = {
>   product: Product;
>   quantity: number;
> };
>
> export type Product = {
>   id: string;
>   name: string;
>   price: number;
>   imageUrl?: string;
>   description: string;
>   stock: number;
> };
>
> type UserRole = 'admin' | 'client' | 'guest';
>
> export type User = {
>   userId: string;
>   email: string;
>   role: UserRole;
> };
> ```

### Qué decidí

Después de analizar las propuestas, decidí incorporar las mejoras relacionadas con:

* agregar `category` y `rating` al tipo `Product`;
* mantener la separación de responsabilidades relacionada con la autenticación;
* adaptar la identificación del usuario pensando en la futura integración con Firebase;
* modelar un usuario no autenticado como `null`, en lugar de utilizar `role: 'guest'`.

No incorporé por el momento la propuesta de modificar `CartItem` para almacenar únicamente `productId` en lugar del objeto `Product`, ya que considero que para la etapa actual del proyecto la estructura existente resulta más sencilla de manejar. Esta decisión podrá revisarse si las necesidades de sincronización entre el carrito y los productos cambian.


### Iteración: incorporación de `displayName` en `User`

**Contexto:**
Al revisar el tipo `User` surgió la necesidad de contar con el nombre del usuario para futuras funcionalidades, como un perfil, un saludo personalizado o una vista de administración. También quería que el modelo fuera compatible con la futura integración con Firebase.

**Prompt (resumido):**

> Si posteriormente necesito crear un registro para cada usuario, ¿debería agregar un nombre al tipo `User`?
>
> Quiero evaluar si conviene utilizar `name` o `displayName` y si este campo debería ser obligatorio u opcional, teniendo en cuenta la futura integración con Firebase.

**Qué decidí:**

Decidí utilizar `displayName` como campo opcional:

```ts
export type User = {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
};
```

Elegí `displayName` para mantener la misma convención de nombres que Firebase y hacerlo opcional para contemplar el caso en que el usuario no tenga un nombre disponible.

Si el dato no existe, la interfaz podrá mostrar un saludo genérico, por ejemplo **"Hola"**, en lugar de asumir que siempre existe un nombre.


## Comprensión del flujo entre hooks y tests

### Contexto técnico

Al implementar los tests de `useProducts`, uno de los tests fallaba aunque el hook funcionaba correctamente. El problema estaba relacionado con que el mensaje del `throw` definido en el hook no coincidía con el texto utilizado en el `toThrow()` del test.

### Prompt (resumido)

> Explicame cómo es el flujo entre un hook que utiliza `useContext` y su test con `renderHook` y `toThrow`.
>
> Quiero entender por qué el test falla cuando el mensaje del error definido en el hook tiene una palabra diferente a la que estoy utilizando en el test, y si existe alguna forma de evitar que el test sea demasiado dependiente del texto exacto del error.

### Qué decidí

Entendí que el mensaje definido en el `throw` del hook y el mensaje utilizado en `toThrow()` son dos strings independientes que deben coincidir para que la comparación funcione.

También entendí que existen dos alternativas:

* comprobar el mensaje específico del error, haciendo el test más preciso pero también más sensible a cambios de texto;
* utilizar `toThrow()` sin especificar el mensaje, verificando únicamente que el hook efectivamente lance un error.

Para este caso decidí mantener la comprobación del mensaje, copiando el texto exacto utilizado en el hook, ya que permite verificar de forma más específica el comportamiento esperado.

Esta situación también me ayudó a entender que un test puede fallar aunque la lógica principal del código sea correcta, simplemente porque la expectativa definida en el test no coincide con el comportamiento que se está comprobando.


## Decisión sobre carrito de usuario invitado

### Contexto técnico

Al integrar `useAuth` con `useCart` surgió la necesidad de definir qué debía suceder cuando un usuario no autenticado intentara agregar productos al carrito.

Las alternativas eran bloquear el carrito hasta iniciar sesión o permitir que el usuario lo arme como invitado y solicitar autenticación posteriormente.

### Prompt

> ¿Cuál es una mejor práctica en e-commerce: bloquear el agregado al carrito hasta que el usuario esté logueado, o permitir armar el carrito como invitado y pedir login recién al momento de comprar?
>
> Analizá las ventajas y desventajas de ambas alternativas teniendo en cuenta la experiencia de usuario y la arquitectura del carrito.

### Qué decidí

Decidí permitir que los usuarios **armen el carrito como invitados**, utilizando la clave `"guest"` para identificarlo.

La autenticación se solicitará recién al momento de continuar con el checkout, donde realmente será necesaria para identificar al usuario y completar la compra.

Consideré que esta alternativa reduce la fricción durante la navegación y permite que el usuario explore y arme su carrito sin necesidad de registrarse previamente.

Para esta etapa del proyecto no es necesario implementar el checkout, pero dejé definida esta decisión arquitectónica para utilizarla cuando se desarrolle esa funcionalidad.


## Optimización de `CartContext`: `useMemo` y `useCallback`

### Contexto técnico

Al memorizar el `value` de `CartContext` utilizando `useMemo`, ESLint indicó que faltaban `addToCart`, `removeFromCart` y `clearCart` en las dependencias.

Al agregarlas apareció un problema adicional: estas funciones se recreaban en cada render porque no estaban memoizadas, por lo que el `useMemo` volvía a ejecutarse constantemente.

### Prompt

> Agregué `addToCart`, `removeFromCart` y `clearCart` como dependencias del `useMemo`, pero ESLint indica que estas funciones cambian en cada render.
>
> ¿Por qué sucede esto y cuál sería la forma correcta de resolverlo, más allá de simplemente eliminar el warning?

### Qué decidí

Decidí utilizar `useCallback` para memorizar las tres funciones, utilizando `[userKey]` como dependencia, y `useMemo` para memorizar también `items`.

De esta manera, las funciones mantienen su referencia mientras no cambie el usuario activo y el `value` del contexto no se recalcula innecesariamente en cada render.

Esta situación me permitió entender que el warning de ESLint no era solamente algo que había que ocultar, sino que estaba señalando un problema real en la cadena de memorización entre `useCallback` y `useMemo`.

## Modelado de `categoryId` y `minAge` en `Product`

### Contexto

Al adaptar el catálogo de Patagonix a MUNDO (juguetería), tuve que redefinir las categorías y agregar la edad recomendada para cada producto.

### Prompt

> Quiero mostrar la edad recomendada de cada juguete como un badge, por ejemplo `+3 años`, pero también poder filtrar por edad más adelante. ¿Conviene guardarlo como texto libre (`"3-5 años"`) o como número?

### Qué decidí

Decidí utilizar `minAge` como un valor numérico, ya que permite formatearlo en la UI y utilizarlo posteriormente para filtros y ordenamiento sin tener que interpretar texto.

Además, para evitar valores arbitrarios, lo restringí mediante un union type con los hitos de edad definidos para el catálogo:

```ts
type MinAge = 1 | 3 | 6 | 8 | 10 | 12;
```

Apliqué el mismo criterio utilizado para restringir `CategoryId`, priorizando tipos específicos sobre valores libres.

## Bug de Rules of Hooks: `return` condicional antes de un hook

### Contexto

Al probar la conexión con Firestore, agregué temporalmente un `useEffect` en `App.tsx`. Sin embargo, tenía un `if (loading) return ...` antes de ese hook.

### Prompt

> La consola muestra un warning de `"change in the order of Hooks"` en `App.tsx`. ¿Por qué ocurre y cómo debería corregirlo?

### Qué aprendí

Entendí que los hooks deben ejecutarse siempre en el mismo orden en cada render.

El `return` condicional hacía que, cuando `loading` era `true`, React saliera del componente antes de llegar al `useEffect`. En un render posterior, cuando `loading` cambiaba, el hook sí se ejecutaba, modificando el orden de ejecución.

La solución fue eliminar el `useEffect` utilizado para debugging una vez comprobada la conexión con Firestore. Como regla general, los `return` condicionales deben ubicarse después de la declaración de los hooks del componente.

## Adaptación del seeder de productos al modelo de MUNDO

### Contexto

El profesor proporcionó un seeder base para poblar Firestore, pero estaba preparado para un catálogo de ropa y calzado y utilizaba una interfaz `Product` diferente a la de mi proyecto.

Mi modelo requiere `categoryId`, `minAge` y `rating`, además de utilizar `imageUrl` en lugar de `image`.

### Prompt

> Tengo este seeder del profesor, pero mi tipo `Product` tiene `categoryId`, `minAge` y `rating` obligatorios, y mis 30 productos ya están definidos con mis propios datos. ¿Qué debería adaptar para que el seeder funcione con mi modelo?

### Qué decidí

Reemplacé el catálogo original por mis 30 juguetes y adapté los campos al modelo de MUNDO.

También mantuve `nameLower`, necesario para implementar la búsqueda por prefijo en Firestore, y `updatedAt` utilizando `serverTimestamp()` para registrar cuándo se actualiza cada producto.

Finalmente, utilicé IDs fijos (`p001` a `p030`) definidos en mi propio array. Esto hace que el seeder sea reproducible y evita crear productos duplicados si se ejecuta nuevamente.

## Cómo se asigna el rol `admin`

### Contexto

Firebase Authentication se encarga de la identidad del usuario, pero el proyecto necesita distinguir entre clientes y administrador.

Como en este proyecto solamente existirá un usuario administrador, necesitaba definir cómo asignar ese rol sin crear un registro público de usuarios administradores.

### Prompt

> ¿Cómo conviene manejar el rol `admin` si solo va a existir un usuario administrador en todo el proyecto? Pensé en utilizar un email fijo como `mundo@jugueteria.com`. ¿Tiene sentido esta estrategia?

### Qué decidí

Decidí utilizar una constante `ADMIN_EMAIL` para identificar al único administrador.

Durante el registro, al crear el documento `users/{uid}` en Firestore, la aplicación compara el email ingresado con esa constante:

* Si coincide → `role: "admin"`
* Si no coincide → `role: "customer"`

De esta manera no existe una opción pública para registrarse como administrador y tampoco necesito modificar manualmente el rol desde Firestore después de cada registro.

El rol se almacena igualmente en Firestore, donde posteriormente podrá ser utilizado por las reglas de seguridad para determinar qué operaciones puede realizar cada usuario.


## Reglas de Firestore bloqueaban la creación del perfil de usuario

### Contexto

Después de integrar `AuthContext` con Firebase Authentication real, el usuario se registraba correctamente en Authentication, pero el documento correspondiente en `users/{uid}` no se creaba en Firestore.

### Prompt

> Firebase Auth registra correctamente al usuario, pero no se crea nada en la colección `users` de Firestore. En la consola del navegador aparece `FirebaseError: Missing or insufficient permissions`. ¿Por qué puede estar ocurriendo?

### Qué aprendí

Entendí que Firebase Authentication y Firestore son servicios independientes: que un usuario exista en Authentication no significa que tenga permisos para escribir en Firestore.

Mis reglas tenían el acceso bloqueado por defecto mediante `allow write: if false`, salvo una excepción temporal utilizada para cargar el seed de productos. Como `users` no tenía una regla específica, la escritura era rechazada.

La solución fue agregar una regla basada en la identidad autenticada:

```text
allow read, write: if request.auth != null
                  && request.auth.uid == userId;
```

De esta manera, un usuario autenticado puede acceder únicamente a su propio documento dentro de `users/{uid}`.

Esta situación me permitió entender la diferencia entre **autenticación** (quién es el usuario) y **autorización** (qué puede hacer ese usuario), y comprobar que las reglas de Firestore forman parte de la seguridad de la aplicación y no son simplemente una configuración adicional.

## Índice compuesto para filtrar por categoría y ordenar por precio

### Contexto

Al implementar el filtro por categoría, `getProductsByCategory` combinaba un `where("categoryId", "==", ...)` con un `orderBy("price", "asc")`.

### Prompt

> Al filtrar por categoría aparece `FirebaseError: The query requires an index`, junto con un link para crearlo. ¿Por qué ocurre y cómo debería resolverlo?

### Qué aprendí

Entendí que Firestore requiere un **índice compuesto** cuando una consulta combina condiciones sobre distintos campos, como un `where` sobre `categoryId` y un `orderBy` sobre `price`.

El error no indicaba un problema en la lógica de mi consulta, sino que faltaba la estructura de índices necesaria para ejecutarla.

La solución fue crear el índice desde el enlace proporcionado por Firebase, que ya incluye los campos necesarios.

Esta situación me permitió entender que, al diseñar consultas en Firestore, también hay que considerar los índices que necesitan para ejecutarse correctamente.


## La búsqueda por nombre ignora el filtro de categoría

### Contexto

Al implementar la búsqueda por nombre con debounce, tuve que definir qué debía ocurrir cuando el usuario ingresaba texto mientras ya tenía una categoría seleccionada.

### Prompt

> ¿Conviene combinar la búsqueda por nombre con el filtro de categoría activo, o hacer que la búsqueda tenga prioridad e ignore la categoría seleccionada?

### Qué decidí

Decidí que la búsqueda por texto tenga prioridad y que, mientras se busca por nombre, se ignore el filtro de categoría.

Combinar ambos criterios en una misma consulta de Firestore agregaría complejidad e implicaría nuevos requisitos de indexación. Como la consigna plantea la búsqueda por nombre y el filtro por categoría como funcionalidades independientes, preferí mantenerlas separadas y utilizar la solución más simple para esta etapa.


## `SearchInput` como componente genérico y reutilizable

### Contexto

El primer `SearchBar` que implementé utilizaba `useProducts()` internamente, por lo que estaba acoplado exclusivamente a la búsqueda de productos.

### Prompt

> Este `SearchBar` solo funciona para productos porque utiliza el context internamente. Más adelante voy a necesitar buscar también órdenes y usuarios desde el panel de administración. ¿Conviene mantenerlo así o separarlo?

### Qué decidí

Decidí separar las responsabilidades:

* `SearchInput`, ubicado en `components/ui/`, se encarga únicamente del input y del debounce y recibe una función `onSearch` por props.
* El componente que lo utiliza, actualmente `ProductsPage`, decide qué hacer con el texto ingresado.

De esta manera, el componente no conoce ningún dominio específico y puede reutilizarse posteriormente para buscar productos, órdenes o usuarios sin duplicar la lógica de debounce.

Esta decisión sigue el mismo criterio de separación entre componentes presentacionales y lógica de negocio que utilicé en otros componentes del proyecto.


## Home separada del catálogo, con filtros sincronizados por URL

### Contexto

La página de productos reunía el hero, las categorías y el catálogo en una sola pantalla. Antes de avanzar con el diseño final, quería validar si convenía separar una Home inspiracional de un catálogo enfocado en la compra.

### Prompt

> Estoy intentando que la experiencia se parezca más a un e-commerce real. ¿Tiene sentido separar una Home con contenido inspiracional de un catálogo con filtros, o conviene mantener todo en una sola página?

### Qué decidí

Decidí separar la navegación en dos pantallas:

* **`/`** → Home con hero, categorías destacadas y productos más elegidos.
* **`/productos`** → Catálogo con filtros y listado completo.

Además, los filtros de categoría se sincronizan mediante **query params** (`?categoria=x`) en lugar de mantenerse solo en estado local, permitiendo compartir, guardar y recuperar búsquedas desde la URL. El filtro por precio permanece del lado del cliente para evitar complejizar las consultas de Firestore con nuevos índices compuestos.

---

## Color propio por categoría con una única fuente de verdad

### Contexto

Quería que cada categoría tuviera una identidad visual propia, en lugar de utilizar un único color para toda la aplicación.

### Prompt

> ¿Podemos hacer que cada categoría conserve su propio color y que esa identidad visual se mantenga en distintos componentes del e-commerce?

### Qué decidí

Definí una paleta específica para cada categoría y una variante más oscura del mismo color para utilizar en textos sobre fondo blanco, garantizando un buen contraste.

Toda la información de colores quedó centralizada en `constants/categories.ts`, evitando duplicar valores en distintos componentes y facilitando futuros cambios de diseño.

---

## Selector de cantidad reutilizando la misma acción del carrito

### Contexto

El detalle de producto necesitaba permitir agregar varias unidades, pero `addToCart` únicamente sumaba un producto por vez.

### Prompt

> El detalle del producto necesita un selector de cantidad. ¿Conviene crear una función nueva para agregar varias unidades o extender `addToCart` sin romper lo que ya funciona?

### Qué decidí

Extendí `addToCart` para aceptar una cantidad opcional con valor por defecto de **1**, manteniendo compatibilidad con los componentes que ya utilizaban esa función.

De esta manera, `ProductCard` continúa agregando una unidad sin modificaciones y el detalle del producto puede incorporar múltiples unidades reutilizando la misma lógica del carrito.

---

## Desborde horizontal en mobile: `grid` y `position: fixed`

### Contexto

Al implementar el panel de resumen fijo del carrito para mobile, la aplicación comenzó a presentar scroll horizontal. El problema también se hacía visible al navegar a otras páginas: el header y la navegación inferior aparecían cortados.

### Prompt

> Al implementar el panel de resumen del carrito como un elemento fijo (position: fixed), apareció un scroll horizontal en mobile. El problema no se limita al carrito: el contenido del header y la bottom navbar también aparecen cortados, y al navegar con React Router a / el desborde continúa. En el carrito tengo un layout con CSS Grid y algunos elementos con contenido variable, como nombres de productos. También estoy utilizando overflow-hidden en algunos contenedores para evitar desbordes. Quiero que analices el problema y determines: qué elemento puede estar generando el ancho adicional; si el comportamiento de CSS Grid y su min-width implícito puede estar provocando el desborde; qué efecto tiene position: fixed sobre el overflow de sus elementos ancestros; si el problema puede quedar afectando al viewport y por qué sigue siendo visible después de cambiar de ruta.

### Qué aprendí

El problema terminó teniendo dos causas relacionadas.

Primero, el `<section>` del carrito utilizaba `grid` sin definir explícitamente sus columnas en mobile. Los elementos de una grid pueden mantener un `min-width` implícito y un contenido largo, como el nombre de un producto, puede hacer que la columna crezca más allá del ancho disponible. La solución fue utilizar `min-width: 0` (`min-w-0`) para permitir que el contenido se adapte al ancho de su columna.

Esto no resolvió completamente el problema porque el panel de resumen utilizaba `position: fixed`. Al estar posicionado respecto del viewport, el elemento no quedaba contenido por el `overflow-hidden` de un contenedor ancestro de la misma manera que un elemento normal del flujo.

Finalmente, moví `overflow-x: hidden` a `html` y `body` en `index.css`, evitando que cualquier elemento pudiera generar scroll horizontal a nivel de la página.

También entendí que el corte que aparecía al navegar a Inicio no significaba que esa página tuviera un problema propio. El desborde horizontal generado anteriormente seguía afectando el viewport, y React Router no reinicia automáticamente la posición del scroll al cambiar de ruta.

Este debugging me permitió diferenciar entre un problema localizado en un componente y un problema de overflow que termina afectando toda la aplicación.


---

## Un error de lint que en realidad era un falso positivo

### Contexto

`npm run lint` marcaba error en dos efectos de fetch de datos (`ProductsContext` y `ProductDetailPage`) por llamar a `setLoading(true)` de forma sincrónica al arrancar el efecto — un patrón estándar de React para mostrar "cargando" mientras se pide de nuevo el dato cada vez que cambia una dependencia.

### Prompt

> npm run lint [pega el error `react-hooks/set-state-in-effect`]

### Qué decidí

Antes de reescribir el código, busqué la regla: es nueva (viene con `eslint-plugin-react-hooks` v7) y el propio equipo de React la tiene documentada como un falso positivo conocido para exactamente este patrón (github.com/react/react/issues/34743), sin una alternativa "limpia" recomendada todavía.

En vez de complicar un efecto que ya estaba bien para complacer una regla inmadura, la desactivé puntualmente en esas dos líneas con `eslint-disable-next-line` y un comentario explicando por qué. Aprendizaje: un error de lint no siempre significa que el código esté mal — a veces significa que la regla todavía no contempla un caso legítimo.

---

## Reutilizar en vez de repetir en el panel de admin

### Contexto

Armando el panel de admin fui repitiendo cosas que ya existían del lado cliente: un `NavLink` a mano por cada item del nav (arriba y en el tab bar de mobile), el wordmark "MUNDO" con sus 5 colores copiado en dos lugares nuevos, y un input de búsqueda simple sin ícono.

### Prompt

> Estoy implementando el panel de administración y detecté que estoy repitiendo algunos elementos que ya existen en la aplicación cliente: los links del navbar, el bottom tab bar, el logo de MUNDO y el buscador.
> Quiero revisar antes de seguir si conviene reutilizar los componentes existentes o crear versiones específicas para admin.
>Analizá qué partes deberían convertirse en componentes o configuraciones reutilizables y cuáles deberían mantenerse separadas por contexto. Busco evitar duplicación sin crear abstracciones innecesarias.


### Qué decidí

En vez de arreglar cada caso por separado, busqué el patrón repetido en cada uno:

- Los items del nav de admin (desktop y mobile) ahora salen de un solo array `ADMIN_NAV_ITEMS`, en vez de un `NavLink` escrito a mano por cada botón en cada lugar.
- El wordmark "MUNDO" (los 5 `span` de colores) se repetía en el Header de cliente y en los dos headers de admin — lo saqué a un componente `MundoLogo` compartido, cada uno solo le pasa el tamaño de letra.
- El buscador de productos del admin tenía un `<input>` plano sin ícono; en vez de agregarle un ícono a mano, reutilicé el componente `SearchInput` que ya existía del lado cliente (mismo look, mismo comportamiento).

Aprendizaje: cuando encuentro el mismo problema (o casi) en dos o tres lugares seguidos, vale la pena parar un momento y sacarlo a un solo lugar en vez de parchear cada aparición — ahorra el próximo cambio también.


## Qué pasa con el carrito de invitado al loguearse

### Contexto

Un usuario no logueado puede navegar y agregar productos al carrito libremente (mejor UX, es el estándar en e-commerce real: no pedirle cuenta hasta el momento de pagar). Pero como el carrito se guarda separado por usuario (`cartsByUser`, con clave `"guest"` para quien no tiene sesión), surgió la duda: ¿qué pasa con esos productos si el invitado se loguea después?

### Prompt

> En el proyecto decidí permitir que un usuario agregue productos al carrito sin autenticarse, utilizando "guest" como identificador del carrito.
> Ahora necesito definir qué debería ocurrir cuando ese usuario inicia sesión: actualmente el carrito de invitado y el carrito del usuario están separados.
> Compará estas alternativas:
> perder el carrito de invitado al iniciar sesión;
> exigir autenticación antes de permitir agregar productos;
> fusionar el carrito de invitado con el carrito del usuario al autenticarse.
> Analizá las implicancias de cada alternativa en UX, modelo de estado y complejidad de implementación. Recomendame una opción para este proyecto y explicá qué casos borde debería contemplar.

### Qué decidí

Evaluamos dos caminos: exigir login para agregar al carrito (más simple de programar, pero mete fricción justo cuando el usuario recién está probando la app), o dejar agregar libremente y fusionar el carrito de invitado con el del usuario en el momento del login (más código, pero es el comportamiento esperado en cualquier tienda online real).

Elegimos fusionar. En `CartContext` agregué un `useEffect` que detecta el instante exacto en que `userKey` pasa de `"guest"` a un uid real (usando un `useRef` para recordar cuál era el valor anterior, porque un componente no tiene memoria del render pasado por sí solo) y, en ese momento, combina los items del carrito de invitado con los del usuario — sumando cantidades si el producto se repite — y borra la entrada de invitado.

Esto obligó a actualizar un test que ya existía (`CartContext.test.tsx`), que afirmaba como correcto el comportamiento viejo (carrito vacío al loguearse). Aprendizaje: un test no solo verifica que el código funcione, también documenta una decisión de producto — si la decisión cambia, el test tiene que cambiar con ella, no solo el código.


---

## Subir imágenes de producto a S3 con URLs prefirmadas

### Contexto

Hasta ahora el campo "imagen" del producto era un `<input type="url">` donde había que pegar un link ya existente. La guía oficial del proyecto pide que las imágenes se puedan subir de verdad desde el form, pero con una regla de seguridad clara: las credenciales de AWS nunca pueden estar en el código del frontend, porque cualquiera que abra las herramientas de desarrollador del navegador las vería y podría usarlas para borrar el bucket o subir lo que quiera a mi cuenta.

### Prompt

> Necesito implementar la subida de imágenes de productos a AWS S3 desde un frontend React/Vite, pero quiero evitar exponer credenciales de AWS en el navegador.
>El flujo que necesito es:
>React → función serverless → URL prefirmada → S3 → imageUrl en Firestore
>Antes de implementarlo, explicame cómo debería dividir las responsabilidades entre frontend, función serverless y S3, y qué información >puede viajar al cliente sin comprometer las credenciales.
>También quiero que tengas en cuenta:
>las credenciales deben permanecer únicamente del lado servidor;
>la URL de subida debe tener una duración limitada;
>el usuario debe poder subir únicamente imágenes;
>el bucket debe aplicar principio de mínimo privilegio;
>la URL final debe poder almacenarse como imageUrl en Firestore.
>No quiero solamente el código: quiero entender por qué necesitamos la función intermedia y qué riesgo existiría si llamáramos a S3 >directamente desde el navegador.

### Qué aprendí

El flujo se llama "URL prefirmada" y funciona así:

1. El navegador le pide permiso a una función serverless propia (`api/presign.ts`, corre en Vercel) para subir un archivo, mandando solo el nombre y el tipo.
2. Esa función es la única parte del sistema que tiene las credenciales de AWS (guardadas como variables de entorno del servidor, sin el prefijo `VITE_` para que Vite no las empaquete en el HTML/JS que baja el navegador). Con esas credenciales le pide a S3 una URL especial que sirve para subir un único archivo, a una ubicación fija, y que caduca en 60 segundos.
3. El navegador usa esa URL para mandar el archivo directo a S3 (`fetch` con método `PUT`), sin pasar por mi servidor — así el archivo no consume ancho de banda mío.
4. La URL pública resultante (armada con el nombre del bucket + la key) es lo que se guarda en Firestore como `imageUrl`.

Para que esto funcione hubo que configurar varias cosas del lado de AWS, cada una con el principio de "mínimo privilegio necesario":

- El bucket sigue privado por default; solo escribí una política que permite *lectura* pública (`s3:GetObject`) de lo que esté dentro de la carpeta `imgProducts/`, nada más.
- Un usuario de IAM aparte (no la cuenta raíz) con permiso únicamente para *escribir* (`s3:PutObject`) en esa misma carpeta — ni puede borrar, ni puede tocar el resto del bucket.
- Un CORS en el bucket, que es lo que le da permiso al navegador (un origen distinto a S3) para poder hacer ese `PUT` directo.

También aprendí que las funciones de `/api` no las podés probar con `npm run dev` normal (eso es solo Vite, el frontend) — hace falta la CLI de Vercel (`vercel dev`) o, como terminamos haciendo, deployar directo a Vercel conectando el repo de GitHub, para probar la función real. Esto adelantó una tarea que iba a ser de las últimas del proyecto (el deploy), pero tuvo sentido hacerlo ahora para poder probar S3 de verdad.


---

## Un cuadrado de color en vez de imagen rota

### Contexto

Al planear el seeder de 60 productos, surgió el problema de que no iba a tener las 60 imágenes reales para subir a S3 (por ahora tengo 30). Mostrar el ícono de imagen rota que pone el navegador por default para esos 30 productos sin foto se ve descuidado, poco profesional.

### Prompt

> Algunos productos todavía no tienen imageUrl porque las imágenes se van a cargar progresivamente desde S3. Quiero evitar que la interfaz muestre el ícono de imagen rota del navegador.
>Pensando en que el mismo producto se muestra en cards, detalle, carrito y panel de administración, ¿conviene resolver este fallback en cada >componente o crear un componente reutilizable?
>Proponeme una solución que:
>contemple productos sin imageUrl;
>también maneje URLs de imágenes que fallen;
>reutilice la información existente de categorías;
>evite duplicar lógica visual en cada lugar donde se muestra un producto.
>Priorizá una solución simple y mantenible, sin crear una abstracción innecesaria.

### Qué decidí

Armé un componente `ProductImage` que reemplaza todos los `<img>` de producto del proyecto (card del catálogo, detalle, carrito, tabla y cards del admin). Su lógica: si el producto no tiene `imageUrl`, o si la que tiene falla al cargar (link roto, todavía no la subimos), muestra un `<div>` del color de la categoría del producto con su ícono correspondiente — en vez de nada, o del ícono roto del navegador.

Para el color y el ícono no inventé nada nuevo: ya existían por separado (`CATEGORY_INFO` tenía los colores, y `CategoryTiles` tenía un mapa de íconos por categoría escrito a mano). Junté los dos en `CATEGORY_INFO`, agregándole un campo `icon`, así quedan en un solo lugar y cualquier componente que necesite "el color o el ícono de esta categoría" tiene una sola fuente de verdad — mismo criterio de reutilización que ya habíamos aplicado en el panel de admin.

Aprendizaje extra: el manejo con `onError` en el `<img>` no es solo para el caso "no hay imagen todavía" — también cubre el caso de una URL rota o que dejó de existir, sin que haya que detectarlo de antemano.


---

## Separar el hook de paginación en uno genérico y uno específico

### Contexto

Armé un hook `useProductsPagination` con la paginación por cursor de Firestore, pensado para el catálogo de cliente. Cuando después migramos también la tabla de productos del admin a cursor, me di cuenta de que ese hook estaba pegado a productos: llamaba directo a `listProducts`/`countProducts`, así que no serviría tal cual el día de mañana para paginar órdenes o usuarios.

### Prompt

> Implementé useProductsPagination utilizando paginación por cursores de Firestore. Ahora necesito reutilizar el mismo mecanismo en el panel de administración y posiblemente más adelante en órdenes y usuarios.
>El problema es que actualmente el hook está acoplado a listProducts y countProducts.
>¿Cómo separarías la mecánica genérica de paginación de la lógica específica de productos?
>Proponé una solución utilizando TypeScript genérico si aporta valor y explicá:
>qué responsabilidad debería tener el hook genérico;
>qué debería permanecer en useProductsPagination;
>cómo evitar duplicar la lógica cuando aparezcan otros dominios.
>Quiero evitar tanto duplicación como sobreingeniería.

### Qué decidí

Separé la lógica en dos capas en vez de una:

- `useCursorPagination<T, C>`: no sabe nada de productos ni de ningún dominio en particular. Recibe una función `fetchPage` (cómo pedir una página) y `fetchCount` (cómo contar el total), y se encarga solo de la mecánica de cursores, página actual, y cuándo resetear a la página 1 cuando cambia el filtro.
- `useProductsPagination`: una capa fina arriba, que sabe traducir `(categoryId, searchPrefix)` en llamadas a `listProducts`/`countProducts` y se las pasa al hook genérico.

Con esta separación, el día que armemos paginación para órdenes o usuarios, solo hace falta escribir el equivalente de `useProductsPagination` para ese dominio (`useOrdersPagination`, etc.) — la parte difícil (cursores, reseteo de página, conteo) ya está resuelta una sola vez.

Aprendizaje: separar "la mecánica genérica" de "el caso de uso específico" no siempre hay que pensarlo desde el principio — a veces se ve más claro recién cuando aparece el segundo lugar que necesita lo mismo (acá fue el admin). Ahí vale la pena parar y extraer la parte compartida, en vez de copiar y pegar la lógica de cursores de nuevo.


---

## Recargar una ruta que no sea el inicio tiraba 404 en Vercel

### Contexto

Investigando en vivo (con herramientas de browser automation) el bug de "buscar un producto y no poder abrir su detalle", probé entrar directo a `/productos` en el deploy de Vercel y me encontré con un 404 aparte, sin relación con ese bug. Antes de arreglarlo le pregunté a Cande qué tan grave era, y confirmó que pasaba en todas las rutas menos el inicio.

### Prompt

> La aplicación funciona correctamente al navegar mediante React Router, pero al recargar directamente rutas como /productos, /carrito o /admin en el deploy de Vercel aparece un 404. La ruta / funciona correctamente.

>El proyecto es una SPA construida con React + Vite + React Router.

>Quiero que diagnostiques por qué la navegación interna funciona pero una recarga directa falla.

>Explicame qué ocurre entre el navegador, Vercel y React Router en cada caso, y qué configuración de deploy necesito para que las rutas del >cliente sean resueltas correctamente sin interferir con las funciones serverless ubicadas en /api.

### Qué aprendí

Es un problema típico de las SPA (single-page apps) deployadas en Vercel. React Router maneja las rutas enteramente en el navegador, con JavaScript: cuando navegás haciendo click en un `<Link>` dentro de la app, nunca hay un pedido nuevo al servidor, así que todo funciona. Pero si recargás la página o entrás directo por la URL a `/carrito` o `/admin`, el navegador le pide *esa ruta puntual* al servidor de Vercel — y como no existe un archivo `carrito.html` ni `admin.html` (todo es un solo `index.html`), Vercel devuelve 404 antes de que React Router llegue siquiera a cargar.

La solución es un archivo `vercel.json` con una regla de "rewrite": para cualquier ruta que no sea una función de `/api`, servir igual `index.html`, y dejar que React Router se encargue de mostrar la pantalla correcta una vez que el JS carga en el navegador:

```json
{
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

El detalle importante es excluir `/api` explícitamente con ese lookahead negativo (`(?!api/)`) — si el rewrite fuera un catch-all de verdad (`/(.*)`), corría el riesgo de interceptar también los pedidos a `api/presign.ts` (la función serverless de S3) y devolver `index.html` en vez de ejecutar la función.


---

## Validaciones de formularios con línea roja, en vez del cartelito nativo del navegador

### Contexto

Los dos formularios del proyecto (crear/editar producto en el admin, y login/registro) solo confiaban en la validación nativa del HTML (`required`, `minLength`, `type="email"`), que muestra el cartelito por default del navegador — no tiene el estilo del resto de la app, y no permite reglas de negocio propias como "el precio no puede ser $0".

### Prompt

> Tengo dos formularios en la aplicación: login/registro y creación/edición de productos.
>Actualmente dependen principalmente de la validación nativa del HTML (required, minLength, type="email"), pero quiero mostrar errores >visuales consistentes con el diseño de la aplicación y agregar reglas de negocio.
>Analizá qué validaciones debería tener cada formulario y qué responsabilidades conviene compartir.
>También quiero evaluar si conviene crear un componente reutilizable para label + input + error, teniendo en cuenta que los campos concretos de cada formulario son diferentes.
>Busco evitar duplicación, pero sin crear un componente Input demasiado genérico que termine teniendo demasiadas props y responsabilidades.

### Qué decidí

El mismo patrón (label + input con borde gris) estaba repetido suelto en el form de productos del admin y en el modal de login/registro, así que armé `FormField`: un componente que envuelve label + campo + mensaje de error, reutilizado en los dos lugares. El input en sí (texto, número, contraseña, textarea) lo sigue armando cada formulario, porque varían demasiado como para forzarlos a uno solo — `FormField` solo estandariza cómo se ve el label y el error.

Las reglas que terminamos definiendo entre las dos: nombre y descripción del producto son obligatorios (no pueden ser solo espacios en blanco), con un largo máximo (60 y 300 caracteres respectivamente, con margen sobre los productos más largos que ya tiene el seeder); el precio tiene que ser mayor a $0 (0 no es un precio válido); el stock no puede ser negativo (0 sí, significa "sin stock", ya se muestra así en la UI). Para el login: email con formato válido, contraseña de al menos 6 caracteres.

Toda la validación corre al tocar "Guardar"/"Ingresar" (no mientras se escribe), y le agregué `noValidate` al `<form>` para apagar el validado nativo del navegador — si no, el cartelito feo del navegador aparece primero y nunca se llega a ver el estilo propio.

Aprendizaje: cuando el mismo pedazo de UI aparece en dos lugares con roles distintos (un form de 6 campos vs. un modal de 2), no hace falta forzarlos a compartir el input completo — alcanza con compartir la parte que sí es idéntica en los dos (el wrapper de label + error) y dejar que cada uno arme su propio campo adentro.


---

## Firestore te deja leer tu propio documento, pero no listar toda la colección: el bug de "el admin no ve las órdenes"

### Contexto

Con el checkout y el panel de órdenes ya armados, probamos el flujo completo en el deploy real de Vercel: comprar como cliente y después revisar en `/admin/ordenes`. La consola tiraba varios `Missing or insufficient permissions`, el admin no veía ninguna orden, y al comprar no aparecía ninguna pantalla de confirmación.

### Prompt

> se hizo el deploy en vercel pero no me funciono, cuando continue compra no me aparecio la vista de confirmar comprar , y en admin no me figura ninguna compra

### Qué aprendí

La regla de `firestore.rules` para `/users` decía `allow read: if request.auth.uid == userId` — pensada para que cada usuario lea su propio perfil. Pero el dashboard y la página de órdenes del admin necesitan traer TODOS los usuarios (para mostrar el email de cada cliente), y ahí apareció una diferencia que no tenía tan clara: en Firestore, un "get" (un documento puntual, por su id) y un "list" (una query sobre toda la colección) se evalúan distinto. La regla `request.auth.uid == userId` funciona perfecto para un `get` (se compara contra el id de ese documento puntual), pero para un `list` sin filtro Firestore necesita poder garantizar que la regla se cumple para *todos* los documentos que la query podría devolver — y como esa condición solo es cierta para un documento (el propio), Firestore rechaza la consulta completa, no solo los documentos ajenos.

La solución fue agregar `|| isAdmin()` a esa regla: como `isAdmin()` no depende de `resource.data` (usa `get()` sobre el documento del usuario logueado), Firestore sí puede garantizar que se cumple para toda la colección cuando quien pregunta es admin.

Un detalle aparte que también corregí: tenía el fetch de órdenes y el de usuarios juntos en un mismo `Promise.all`, así que cuando uno de los dos fallaba por permisos, el error tumbaba a los dos — por eso "no aparecía ninguna orden" en el admin, aunque sí se habían creado bien.

### Qué decidí

También agregamos la pantalla de confirmación que pide la consigna después de comprar: antes solo se mostraba un toast y redirigía directo a "Mis pedidos", pero la consigna pide un flujo de checkout que se pueda "revisar y confirmar". Ahora, al terminar la compra, se ve una pantalla con el detalle de lo comprado y el número de pedido, con botones para ir a "Mis pedidos" o seguir comprando. El toast de "¡Compra realizada con éxito!" se mantiene, pero ahora acompaña a esa pantalla en vez de reemplazarla.


---

## Al confirmar la compra, el toast decía "éxito" pero la pantalla mostraba el carrito vacío

### Contexto

Al armar el paso de "Confirmar compra", el botón crea la orden, vacía el carrito y navega a la pantalla de "¡Compra realizada!". Funcionaba en la mayoría de las pruebas, pero a veces terminaba mostrando "Tu carrito está vacío" en vez de la confirmación, aunque el toast de éxito sí había aparecido.

### Prompt

> Tengo un problema en el flujo de checkout. Al confirmar una compra, la orden se crea correctamente y aparece el toast de éxito, pero la aplicación termina mostrando "Tu carrito está vacío" en lugar de la pantalla de confirmación.
>El flujo actual hace tres cosas:
>crea la orden;
>ejecuta clearCart();
>navega a la pantalla de confirmación.
>Además, la pantalla tiene una guarda que redirige a /carrito cuando el carrito está vacío.
>Analizá la interacción entre estas actualizaciones de estado, navigate, el render posterior y el isSubmitting. Quiero entender por qué la >guarda se ejecuta aunque la compra haya sido exitosa.
>Proponé una solución que además evite un doble submit y explicá cuándo tendría sentido utilizar useState y cuándo useRef para este caso.

### Qué aprendí

La pantalla de "Confirmar compra" tenía una guarda `if (carrito vacío) → redirigir a /carrito`, pensada para cuando alguien entra directo a esa URL sin nada en el carrito. El problema es que, al confirmar, `clearCart()` también vacía el carrito — así que esa misma guarda se disparaba justo después de comprar, y competía con el `navigate()` a la pantalla de éxito.

Mi primer intento de arreglo fue agregar una condición extra: no redirigir si `isSubmitting` seguía en `true`. Probé eso y seguía fallando. Ahí entendí el motivo real: dentro del `try/catch/finally`, el `finally` que pone `isSubmitting` de nuevo en `false` corre en el mismo tick, antes de que React vuelva a renderizar — React agrupa (batchea) todas esas actualizaciones de estado (`navigate`, `clearCart`, `setIsSubmitting`) y las aplica juntas en un solo render. Para ese momento, `isSubmitting` ya había vuelto a `false`, así que mi condición nunca alcanzaba a bloquear nada: llegaba tarde.

La solución fue usar un `useRef` en vez de un `useState` para esa bandera puntual. Un ref no dispara re-render y, más importante, su valor está disponible inmediatamente en cuanto se lo asigna (`orderPlacedRef.current = true`), sin pasar por el ciclo de batching de React. Así, para cuando el componente vuelve a evaluar la guarda del carrito vacío, el ref ya refleja que la compra se confirmó, y no compite con la navegación a la pantalla de éxito.

### Qué decidí

Como regla general para el resto del proyecto: cuando una condición necesita frenar algo que puede pasar en el mismo instante en que se actualiza el propio estado que la dispara (una carrera contra el propio `setState`), un `state` común no alcanza — hace falta un `ref`, que se lee "en el momento" y no espera el siguiente render.


---

## El carrito usaba useState y la consigna pedía useReducer: lo refactoricé antes de escribir los tests

### Contexto

Al ponerme a escribir los tests del carrito siguiendo mis apuntes de clase (fixtures, `renderWithProvider`, `cartReducer.test.ts`), me di cuenta de que ese archivo no podía existir: `CartContext` manejaba el carrito con `useState`, no con `useReducer`, así que no había ningún reducer puro para testear por separado.

### Prompt

> Al comenzar a escribir los tests del carrito detecté que mi CartContext utiliza useState para manejar varias acciones (addToCart, removeFromCart, updateQuantity, clearCart), pero la consigna plantea utilizar useReducer y testear el reducer de forma aislada.
> Antes de refactorizar quiero evaluar si realmente useReducer aporta una ventaja en este caso o si sería una complejidad innecesaria.
> Compará useState vs useReducer para este carrito teniendo en cuenta:
> cantidad de transiciones de estado;
> facilidad de testing;
> separación entre lógica pura y efectos secundarios;
> mantenibilidad;
> complejidad que agrega cada alternativa.
> Si recomendás useReducer, explicá cómo debería quedar separada la lógica del reducer respecto de CartContext.

### Qué decidí

Le pregunté a Claude si convenía refactorizar el carrito a `useReducer` antes de seguir, o dejarlo como estaba y testear el hook directamente. La consigna pide `useReducer` para el carrito en varios lugares (checklist de arquitectura, checklist de testing, y es literalmente una de las preguntas de la defensa oral: "¿por qué useReducer y no useState para el carrito?"), así que decidí refactorizar.

Se extrajo toda la lógica de `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart` y la fusión del carrito de invitado al loguearse a una función pura `cartReducer` (en `src/contexts/cartReducer.ts`), con un action por caso (`ADD_TO_CART`, `REMOVE_FROM_CART`, `UPDATE_QUANTITY`, `CLEAR_CART`, `MERGE_GUEST_CART`). `CartContext` ahora solo hace `dispatch(...)` y se encarga de los side effects (los toasts), que no pueden vivir adentro del reducer porque tienen que quedar puros.

### Qué aprendí

Un reducer puro (mismo estado + misma acción → siempre el mismo resultado nuevo, sin tocar nada de afuera) es mucho más fácil de testear que un `useState` con lógica de actualización desparramada en varios `setCartsByUser(prev => ...)`: alcanza con pasarle un estado de entrada y una acción, y comparar contra el estado de salida esperado, sin renderizar nada ni mockear Firebase. Esa es la ventaja concreta de `useReducer` sobre `useState` cuando el estado tiene varias acciones posibles: centraliza toda la lógica de "cómo cambia el estado" en un solo lugar testeable de forma aislada, en vez de tenerla repartida en cada función que actualiza estado.

De paso armé el resto de la base de testing: `src/test/fixtures.ts` (datos falsos de producto/usuario/carrito/orden), mocks globales de Firebase en `setupTests.ts` (para que ningún test dependa de una conexión real), `src/test/renderWithProviders.tsx` (wrapper con el mismo árbol de providers que la app real), un test de integración del flujo "agregar al carrito" end-to-end, y un test aislado de `useCart` con `renderHook`.


## Cobertura de tests: priorizar antes de llegar al 85%
 
### Contexto
Después de sumar tests para orders, users y rutas, todavía estaba lejos del 85% que pide el profe. En vez de tirar tests a lo loco por todos lados, le pregunté a Claude qué le parecía priorizar por importancia real más que por perseguir el porcentaje.
 
### Prompt
> El proyecto actualmente tiene una cobertura aproximada del 44%, pero la consigna establece un objetivo del 85%.
> No quiero agregar tests únicamente para aumentar el porcentaje. Quiero priorizar aquellos que cubran comportamiento crítico y reduzcan > riesgos reales.
> Teniendo en cuenta la arquitectura actual, evaluá qué debería testear primero entre:
> products.services;
> CheckoutConfirmPage;
> upload.services;
> manejo de errores de autenticación;
> AppRoutes;
> AuthContext;
> AppProviders.
> Priorizá los casos según riesgo e impacto funcional y explicá qué tipo de test corresponde en cada caso (unitario, integración o > comportamiento de UI).
> Si una pieza no aporta demasiado valor al testing, prefiero dejarla sin cubrir antes que escribir tests artificiales solo para aumentar el coverage.
 
### Qué decidí
Decidí priorizar por lo que de verdad importa para el negocio y no por perseguir el número: primero products.services y CheckoutConfirmPage (evitar dobles compras es crítico), después upload.services y authErrors por ser piezas chicas y aisladas fáciles de dejar en 100%, y por último los archivos que arman el esqueleto de la app (AppRoutes, AuthContext, AppProviders) porque ahí se juega que todo el sistema arranque bien. Con esto la cobertura subió de 44.71% a 63.45% en statements, y me sirvió más entender qué estaba probando cada archivo que perseguir el 85% a ciegas.
 
### Qué aprendí
Aprendí que CheckoutConfirmPage evita el doble submit con dos mecanismos combinados: un estado `isSubmitting` que deshabilita el botón mientras se procesa la orden, y una ref (`orderPlacedRef`) que se lee en el mismo render para no disparar una redirección falsa al carrito justo en el instante en que se limpia el carrito y se navega a la confirmación. También aprendí una trampa común al testear rutas protegidas: si el mock de `onAuthStateChanged` dispara automáticamente "sin usuario" apenas se registra, `ProtectedRoute` redirige con `replace` ANTES de que el test llegue a loguearse, y esa navegación ya no se puede deshacer después aunque el login sea válido.