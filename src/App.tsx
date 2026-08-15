// src/App.tsx
import { Header } from "./components/layout/Header";
import { BottomTabBar } from "./components/layout/BottomTabBar";
import { AppRoutes } from "./routes/AppRoutes";

function App(): JSX.Element {
  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0 overflow-x-hidden">
      <Header />
      <AppRoutes />
      <BottomTabBar />
    </div>
  );
}

export default App;
