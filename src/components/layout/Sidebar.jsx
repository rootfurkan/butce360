import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogoutBtn = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4 4H10V10H4V4Z" />
          <path d="M14 4H20V10H14V4Z" />
          <path d="M4 14H10V20H4V14Z" />
          <path d="M14 14H20V20H14V14Z" />
        </svg>
      ),
    },
    {
      title: "İşlemler",
      path: "/transactions",
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M6 7H18" />
          <path d="M6 12H18" />
          <path d="M6 17H13" />
          <path d="M16 15L18 17L21 13" />
        </svg>
      ),
    },
    {
      title: "İşlem Ekle",
      path: "/transactions/add",
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M5 6.5H19" />
          <path d="M5 12H13" />
          <path d="M5 17.5H11" />
          <path d="M17 14V22" />
          <path d="M13 18H21" />
        </svg>
      ),
    },
    {
      title: "Ödemeler",
      path: "/auto-payments",
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M5 7H19V17H5V7Z" />
          <path d="M8 11H16" />
          <path d="M8 14H12" />
        </svg>
      ),
    },
    {
      title: "Raporlar",
      path: "/reports",
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M6 19V11" />
          <path d="M12 19V5" />
          <path d="M18 19V8" />
        </svg>
      ),
    },
    {
      title: "AI Tahmin",
      path: "/ai-forecast",
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" />
          <path d="M19 15L19.8 17.2L22 18L19.8 18.8L19 21L18.2 18.8L16 18L18.2 17.2L19 15Z" />
        </svg>
      ),
    },
    {
      title: "Ayarlar",
      path: "/profile",
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5A3.5 3.5 0 0 0 12 15.5Z" />
          <path d="M19 12A7 7 0 0 0 18.86 10.6L21 8.9L19 5.45L16.48 6.45A7.5 7.5 0 0 0 14.05 5.05L13.7 2.35H10.3L9.95 5.05A7.5 7.5 0 0 0 7.52 6.45L5 5.45L3 8.9L5.14 10.6A7 7 0 0 0 5.14 13.4L3 15.1L5 18.55L7.52 17.55A7.5 7.5 0 0 0 9.95 18.95L10.3 21.65H13.7L14.05 18.95A7.5 7.5 0 0 0 16.48 17.55L19 18.55L21 15.1L18.86 13.4A7 7 0 0 0 19 12Z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-content">
        <div className="sidebar-brand">
          <h2>Bütçe360</h2>
          <p>Hesabınızı Yönetin</p>
        </div>

        <nav className="sidebar-menu" aria-label="Ana menü">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="sidebar-exit-button"
          onClick={handleLogoutBtn}
        >
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
