import { Outlet } from "react-router-dom";
import logo from "../assets/logo.svg"

export function Layout() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
            <img src={logo} alt="TRGlobal Store" />
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

        </div>
      </footer>
    </div>
  );
}
