// src/App.tsx
import { useLocation } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { BottomTabBar } from "./components/layout/BottomTabBar";
import { Footer } from "./components/layout/Footer";
import { AppRoutes } from "./routes/AppRoutes";

function App(): JSX.Element {
  // El panel de admin tiene su propio layout (AdminLayout: nav + tabs
  // propios), así que ocultamos el Header/BottomTabBar de cliente ahí para
  // no mostrar dos navegaciones pisándose.
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {!isAdminRoute && <Header />}
      <div className={isAdminRoute ? "" : "pb-16 md:pb-0"}>
        <AppRoutes />
        {!isAdminRoute && <Footer />}
      </div>
      {!isAdminRoute && <BottomTabBar />}
    </div>
  );
}

export default App;
