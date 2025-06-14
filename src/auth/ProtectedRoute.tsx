import React, {JSX} from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return null; // Or show a spinner

    return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
