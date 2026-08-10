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
