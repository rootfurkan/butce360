import React from "react";

const Header = ({ title = "İşlemler" }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <h1>{title}</h1>

        <div className="header-search">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M10.8 18.1C14.8317 18.1 18.1 14.8317 18.1 10.8C18.1 6.76832 14.8317 3.5 10.8 3.5C6.76832 3.5 3.5 6.76832 3.5 10.8C3.5 14.8317 6.76832 18.1 10.8 18.1Z" />
            <path d="M16.2 16.2L20.5 20.5" />
          </svg>

          <input type="text" placeholder="İşlemlerde ara..." />
        </div>
      </div>

      <div className="header-actions">
        <button type="button" className="header-icon-button" aria-label="Bildirimler">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 9.8C18 6.48 15.31 3.8 12 3.8C8.69 3.8 6 6.48 6 9.8V12.8L4.5 16.2H19.5L18 12.8V9.8Z" />
            <path d="M10 18.3C10.35 19.35 11.14 20 12 20C12.86 20 13.65 19.35 14 18.3" />
          </svg>
        </button>

        <button type="button" className="header-icon-button" aria-label="Yardım">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" />
            <path d="M9.75 9.5C10.05 8.45 10.86 7.75 12.1 7.75C13.45 7.75 14.35 8.55 14.35 9.7C14.35 11.55 12 11.7 12 13.4" />
            <path d="M12 16.35H12.01" />
          </svg>
        </button>

        <button type="button" className="header-profile" aria-label="Profil">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop"
            alt="Profil"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;