import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import MainLayout from "../components/layout/MainLayout";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import AddTransaction from "../pages/AddTransaction";
import AutoPayments from "../pages/AutoPayments";
import Reports from "../pages/Reports";
import AiForecast from "../pages/AiForecast";
import Profile from "../pages/Profile";
import EditUser from "../pages/EditUser";
import Register from "../pages/Register";

const ProtectedLayout = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout />;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transactions/add" element={<AddTransaction />} />
        <Route path="/auto-payments" element={<AutoPayments />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/ai-forecast" element={<AiForecast />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/users/:id/edit" element={<EditUser />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRouter;
