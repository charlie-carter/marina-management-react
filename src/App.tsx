import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AccountView from "./pages/AccountView.tsx";
import ParkingDetails from "./pages/ParkingDetails.tsx";
import AddGuestCar from "./pages/AddGuestCar.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/account-view/:id" element={<AccountView />} />
                <Route path="/car-details/:id" element={<ParkingDetails />} />
                <Route path="/add-car" element={<AddGuestCar />} />
            </Routes>
        </Router>
    );
};

export default App;
