1) 
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
