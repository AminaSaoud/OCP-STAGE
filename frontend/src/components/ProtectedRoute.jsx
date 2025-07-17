import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    // Optionnel : affiche un loader ou rien du tout
    return null;
  }

  if (!user) {
    // Pas connecté : redirige vers login
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Mauvais rôle : redirige vers accueil ou page d’erreur
    return <Navigate to="/" replace />;
  }

  // Autorisé : affiche la page demandée
  return children;
};

export default ProtectedRoute;
