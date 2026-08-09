import { useCart } from "./hooks/useCart";
import { useProducts } from "./hooks/useProducts";

function App(): JSX.Element {
  //* Tomar valor DarkMode desde sistema y aplicarlo:
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", isDark);

  //* Estados desde ProductsContext:
  const { products } = useProducts();

  //* Estados y Acciones desde CartContext:
 const {items, addToCart, removeFromCart, clearCart} = useCart();

  return (
    <div className="p-8">
      <h1>Carrito de Compras</h1>
      <hr className="my-4" />
      <h2>Productos</h2>
      <div className="flex flex-wrap gap-4">
        {products.map((product) => (
          <button key={product.id} onClick={() => addToCart(product)}>
            {product.name} - ${product.price}
          </button>
        ))}
      </div>
      <hr className="my-4" />
      <h2>Items en el carrito</h2>
      {items.length === 0 ? (
        <p>No hay productos en el carrito</p>
      ) : (
        <div>
          <ul>
            {items.map((item) => (
              <li key={item.product.id}>
                <strong>{item.product.name}</strong>
                {" - $"}
                {item.product.price}
                {" | Cantidad: "}
                {item.quantity}
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="ml-4"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          <button onClick={clearCart}>Limpiar carrito</button>
        </div>
      )}
    </div>
  );
}


export default App
