// src/App.tsx
import { Header } from "./components/layout/Header";
import { AppRoutes } from "./routes/AppRoutes";

function App(): JSX.Element {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <AppRoutes />
    </div>
  );
}

export default App;
