// src/App.tsx
import { Header } from "./components/layout/Header";
import { ProductsPage } from "./pages/ProductsPage";

function App() {
  return (
    <div className="min-h-screen bg-bg-cool">
      <Header />
      <ProductsPage />
    </div>
  );
}

export default App;