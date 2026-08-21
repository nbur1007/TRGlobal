import { Link, Outlet } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useAuth } from "../context/AuthContext";
import { CartIcon } from "./CartIcon";
import { useToast } from "../context/ToastContext";

export function Layout() {
  const { user, loading, logout } = useAuth();
  const { message } = useToast();
  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <Link to="/" className="logo-link">
            <img className="logo" src={logo} alt="TRGlobal Store" />
          </Link>

          <nav>
            {loading ? null : user ? (
              <>
                <Link to="/">Catalogue</Link>
                {user.role === "CUSTOMER" && (
                  <Link to="/orders" style={{ textDecoration: "none" }}>
                    Orders
                  </Link>
                )}
                {user.role === "CUSTOMER" && (
                  <div className="cart-link-wrapper">
                    <Link to="/cart" className="nav-icon-link">
                      <CartIcon />
                    </Link>
                    {message && <div className="toast">{message}</div>}
                  </div>
                )}
                {user.role === "ADMIN" && <Link to="/admin">Admin</Link>}
                <button onClick={logout} className="link-button">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/">Catalogue</Link>
                <Link to="/login">Log in</Link>
                <Link to="/register" className="link-button">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="navcontainer"></div>
      </header>

      <main className="app-main">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>©TRGlobal, 2026</p>
        </div>
      </footer>
    </div>
  );
}
