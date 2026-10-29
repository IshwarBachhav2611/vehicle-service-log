
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Vehicles from "./pages/Vehicles";
import Services from "./pages/Services";
import Schedule from "./pages/Schedule";
import "./App.css";

function App() {
  const [user, setUser] = useState(() => {
    const token = sessionStorage.getItem("token");
    const savedUser = sessionStorage.getItem("user");

    if (!token || !savedUser) return null;

    try {
      return JSON.parse(savedUser);
    } catch {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      return null;
    }
  });

  const [authPage, setAuthPage] = useState("login");
  const [activePage, setActivePage] = useState("Dashboard");

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setActivePage("Dashboard");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
    setAuthPage("login");
    setActivePage("Dashboard");
  };

  if (!user) {
    return authPage === "register" ? (
      <Register
        onRegister={handleLogin}
        onSwitchToLogin={() => setAuthPage("login")}
      />
    ) : (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() => setAuthPage("register")}
      />
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case "Vehicles":
        return <Vehicles />;
      case "Services":
        return <Services />;
      case "Schedule":
        return <Schedule />;
      default:
        return (
          <div className="dashboard-content">
            <h2>Welcome, {user.name}!</h2>
            <p>
              Manage your vehicles, track service history, and view
              upcoming maintenance.
            </p>

            <div className="dashboard-cards">
              <button
                className="dashboard-card"
                onClick={() => setActivePage("Vehicles")}
              >
                <span>🚗</span>
                <h3>Vehicles</h3>
                <p>Manage your registered vehicles.</p>
              </button>

              <button
                className="dashboard-card"
                onClick={() => setActivePage("Services")}
              >
                <span>🔧</span>
                <h3>Service Records</h3>
                <p>Add and review vehicle maintenance.</p>
              </button>

              <button
                className="dashboard-card"
                onClick={() => setActivePage("Schedule")}
              >
                <span>📅</span>
                <h3>Service Schedule</h3>
                <p>Check upcoming maintenance.</p>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span>🚘</span>
          <h2>VehicleCare</h2>
        </div>

        <nav className="sidebar-nav">
          {["Dashboard", "Vehicles", "Services", "Schedule"].map(
            (page) => (
              <button
                key={page}
                className={`nav-item ${
                  activePage === page ? "active" : ""
                }`}
                onClick={() => setActivePage(page)}
              >
                {page === "Dashboard" && "🏠"}
                {page === "Vehicles" && "🚗"}
                {page === "Services" && "🔧"}
                {page === "Schedule" && "📅"}
                <span>{page}</span>
              </button>
            )
          )}
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          ↪ Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>{activePage}</h1>
            <p>Vehicle Service Log Management</p>
          </div>

          <div className="user-info">
            <div className="user-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <span>{user.name}</span>
          </div>
        </header>

        {renderPage()}
      </main>
    </div>
  );
}

export default App;
