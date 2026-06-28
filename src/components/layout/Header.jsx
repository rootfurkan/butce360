import React from "react";
import { useSelector } from "react-redux";

const Header = ({ title = "İşlemler" }) => {
  const currentUser = useSelector((state) => state.auth.currentUser);

  const firstName = currentUser?.ad || currentUser?.name || "";
  const lastName = currentUser?.soyad || currentUser?.surname || "";
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <header className="app-header">
      <div className="header-left">
        <h1>{title}</h1>
      </div>

      <div className="header-actions">
        <p className="header-welcome-text">
          Hoş geldin{fullName ? `, ${fullName}` : ""}
        </p>
      </div>
    </header>
  );
};

export default Header;
