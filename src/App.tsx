/*
  Copyright © 2025 Charlie Carter
  All rights reserved.

  This file is part of DockDesk.
  Unauthorized copying, modification, or distribution of this software,
  via any medium, is strictly prohibited.

  For licensing inquiries, contact: csc115@outlook.com
*/

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AccountView from "./pages/AccountView";
import ParkingDetails from "./pages/ParkingDetails";
import AddGuestCar from "./pages/AddGuestCar";
import AddAccount from "./pages/AddAccount";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/account-view/:id"
                        element={
                            <ProtectedRoute>
                                <AccountView />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/car-details/:id"
                        element={
                            <ProtectedRoute>
                                <ParkingDetails />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/add-car"
                        element={
                            <ProtectedRoute>
                                <AddGuestCar />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/add-account"
                        element={
                            <ProtectedRoute>
                                <AddAccount />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
