import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CataloguePage } from "./pages/CataloguePage";
import "./App.css";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { CartPage } from "./pages/CartPage";
import { OrderHistoryPage } from "./pages/OrderHistoryPage";
import { AdminPage } from "./pages/AdminPage";
import { ToastProvider } from "./context/ToastContext";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<CataloguePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/cart" element={<CartPage />} />
                <Route path="/order" element={<OrderHistoryPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                <Route path="/orders" element ={<OrderHistoryPage />} />
              </Route>
              <Route element={<ProtectedRoute role="ADMIN" />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
