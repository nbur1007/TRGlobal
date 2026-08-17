import { Link, Outlet } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useAuth } from "../context/AuthContext";

export function Layout() {
  const { user, loading, logout } = useAuth();
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
                {user.role === "CUSTOMER" && <Link to="/cart">Cart</Link>}
                {user.role === "ADMIN" && <Link to="/admin">Admin</Link>}
                <Link to="/orders">Orders</Link>
                <button onClick={logout} className="link-button">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Log in</Link>
                <Link to="/register" className="button-primary">
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
