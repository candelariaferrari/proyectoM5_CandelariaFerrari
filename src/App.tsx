// src/App.tsx
import { useLocation } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { BottomTabBar } from "./components/layout/BottomTabBar";
import { Footer } from "./components/layout/Footer";
import { Toast } from "./components/ui/Toast";
import { AppRoutes } from "./routes/AppRoutes";

function App(): JSX.Element {
  // El panel de admin tiene su propio layout (AdminLayout: nav + tabs
  // propios), así que ocultamos el Header/BottomTabBar de cliente ahí para
  // no mostrar dos navegaciones pisándose.
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin");
  // Productos y Carrito quieren su propio scroll interno (en la grilla y en
  // la lista de items, respectivamente) en vez del scroll de toda la
  // página, para que el footer -y en Productos, la paginación- se vean
  // siempre sin scrollear. Eso solo se activa de md hacia arriba: en
  // mobile la página sigue scrolleando entera como el resto del sitio (hay
  // menos alto disponible, y ya conviven elementos fixed -el BottomTabBar,
  // el resumen colapsable del carrito- como para sumarle encima un área
  // con scroll propio). El h-screen+overflow-hidden de acá son los que le
  // dan a esas páginas un techo real de altura; sin esto, un div hijo con
  // h-full no tiene de qué "100%" tomar altura.
  const isFixedShellRoute = pathname.startsWith("/productos") || pathname === "/carrito";

  return (
    <div
      className={`min-h-screen bg-white overflow-x-hidden flex flex-col ${
        isFixedShellRoute ? "md:h-screen md:overflow-hidden" : ""
      }`}
    >
      {!isAdminRoute && <Header />}
      {/* flex-1 + min-h-0: le dan a <main> una altura DEFINIDA (la calcula
          el flexbox de arriba), que es lo que necesita cualquier página hija
          con md:h-full para poder heredar un alto real. A propósito NO es
          "flex flex-col": eso convertiría a la sección raíz de cada página
          (max-w-[1280px] mx-auto) en un ítem flex, y un ítem flex con ancho
          "auto" + márgenes automáticas se centra según su contenido en vez
          de estirarse -- exactamente el bug de "ancho angosto/centrado" que
          reportó Cande en Productos (skeleton vs. grilla cargada) y en el
          Carrito. <main> tiene un solo hijo, así que no hace falta flexbox
          acá adentro para nada. */}
      <main className="flex-1 min-h-0">
        <AppRoutes />
      </main>
      {!isAdminRoute && (
        <div className="pb-16 md:pb-0 shrink-0">
          <Footer />
        </div>
      )}
      {!isAdminRoute && <BottomTabBar />}
      <Toast />
    </div>
  );
}

export default App;
