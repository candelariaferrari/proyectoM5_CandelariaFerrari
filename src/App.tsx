// src/App.tsx
import { useState } from "react";
import { Header } from "./components/layout/Header";
import { BottomTabBar } from "./components/layout/BottomTabBar";
import { AppRoutes } from "./routes/AppRoutes";

function App(): JSX.Element {
  // Vive acá (no en el Header) porque tanto la lupa del Header como el botón
  // "Buscar" de la BottomTabBar (mobile) tienen que poder abrir la misma
  // barra de búsqueda — son dos componentes hermanos, así que el estado
  // compartido sube al padre en común. No hace falta Context para esto: son
  // solo dos consumidores, un Context sería más ceremonia que la que resuelve.
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <Header
        isMobileSearchOpen={isMobileSearchOpen}
        onToggleMobileSearch={() => setIsMobileSearchOpen((open) => !open)}
      />
      <AppRoutes />
      <BottomTabBar onSearchClick={() => setIsMobileSearchOpen(true)} />
    </div>
  );
}

export default App;
