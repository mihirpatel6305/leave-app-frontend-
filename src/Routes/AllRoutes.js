import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MyLeave from "../pages/myLeave";
import AllLeaveRequest from "../pages/AllLeaveRequest";
import Layout from "../Component/Layout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Myteam from "../pages/Myteam";
import TeamLeaveRequest from "../pages/TeamLeaveRequest";
import AllEmployees from "../pages/AllEmployees";

const AllRoutes = () => {
  return (
    <Routes>
      {/* Protected Routes (Requires Login) */}
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myLeave"
          element={
            <ProtectedRoute>
              <MyLeave />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teamLeaveRequest"
          element={
            <ProtectedRoute>
              <TeamLeaveRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/allLeaveRequest"
          element={
            <ProtectedRoute>
              <AllLeaveRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/allemployees"
          element={
            <ProtectedRoute>
              <AllEmployees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Myteam"
          element={
            <ProtectedRoute>
              <Myteam />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Public Routes (Login/Register only if not logged in) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
    </Routes>
  );
};

export default AllRoutes;
