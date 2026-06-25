import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const MainLayout = () => {
  const location = useLocation();

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/transactions": "İşlemler",
    "/transactions/add": "İşlem Ekle",
    "/auto-payments": "Otomatik Ödemeler",
    "/reports": "Raporlar",
    "/ai-forecast": "AI Finansal Tahmin",
    "/profile": "Profil",
  };

  const getPageTitle = () => {
    if (location.pathname.startsWith("/profile/users/")) {
      return "Kullanıcı Düzenle";
    }

    return pageTitles[location.pathname] || "Bütçe360";
  };

  return (
    <>
      <Sidebar />
      <Header title={getPageTitle()} />

      <main className="page-layout">
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default MainLayout;
