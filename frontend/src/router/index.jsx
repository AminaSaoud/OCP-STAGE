import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/AuthPage";
import AdminLogin from "../pages/Admin/AdminAuthPage";
import DemandeSubmissionForm from "../pages/Collaborateur/AjouterDemande";
import MesDemandes from "../pages/Collaborateur/MesDemandes";
import DashboardTechnique from "../pages/Technique/DashboardTechnique";
import ProtectedRoute from "../components/ProtectedRoute";
import DetailDemandeTechnique from "../pages/Technique/DetailDemandeTechnique";
import Dashboard from "../pages/Admin/Dashboard";
import AjouterControleurTechnique from "../pages/Admin/AjouterControleurTechnique";
import AllControleursTechnique from "../pages/Admin/AllControleursTechnique";
import ModifierControleurTechnique from "../pages/Admin/ModifierControleurTechnique";
import Archives from "../pages/Admin/Archives";
import ForceChangePassword from "../pages/ForceChangePassword";
import AjouterCollaborateur from "../pages/Admin/AjouterCollaborateur";
import AllCollaborateurs from "../pages/Admin/AllCollaborateurs";
import ModifierCollaborateur from "../pages/Admin/ModifierCollaborateur";
import AjouterControleurMagasin from "../pages/Admin/AjouterControleurMagasin";
import AllControleursMagasin from "../pages/Admin/AllControleursMagasin";
import ModifierControleurMagasin from "../pages/Admin/ModifierControleurMagasin";
import DetailDemandeCollaborateur from "../pages/Collaborateur/DetailDemandeCollaborateur";
import DemandeMateriel from "../pages/controleur_materiel/DemandeMateriel";
import DetailDemandeMateriel from "../pages/controleur_materiel/DetailDemandeMateriel";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
   {
    path: "/login", 
    element: <Login />,
  },



  

  {
    path: "/admin/login", 
    element: 
     <AdminLogin /> ,
  },





  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute requiredRole="admin"> 
        <Dashboard />
      </ProtectedRoute> 
    )
  },
  {
    path: "/admin/collaborateurs/ajouter",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AjouterCollaborateur />
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/collaborateurs",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AllCollaborateurs />
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/collaborateurs/modifier/:id",
    element: (
      <ProtectedRoute requiredRole="admin">
        <ModifierCollaborateur />
      </ProtectedRoute>
    )
  },
  
  // Routes pour les contrôleurs de magasin
  {
    path: "/admin/controleurs-magasin/ajouter",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AjouterControleurMagasin />
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/controleurs-magasin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AllControleursMagasin />
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/controleurs-magasin/modifier/:id",
    element: (
      <ProtectedRoute requiredRole="admin">
        <ModifierControleurMagasin />
      </ProtectedRoute>
    )
  },
  
  // Routes pour les contrôleurs technique
  {
    path: "/admin/controleurs-technique/ajouter",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AjouterControleurTechnique />
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/controleurs-technique",
    element: (
        <ProtectedRoute requiredRole="admin">
        <AllControleursTechnique />
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/controleurs-technique/modifier/:id",
    element: (
      <ProtectedRoute requiredRole="admin">
        <ModifierControleurTechnique />
      </ProtectedRoute>
    )
  },
  
  // Route pour les archives
  {
    path: "/admin/archives",
    element: (
        <ProtectedRoute requiredRole="admin">
        <Archives />
      </ProtectedRoute>
    )
  },
  
  {
    path: "/force-change-password",
    element: <ForceChangePassword />
  },


//////////

  {
    path: "/collaborateur/demande", 
    element:( <ProtectedRoute><DemandeSubmissionForm /> </ProtectedRoute>),
  },

  {
    path: "/collaborateur/demande/:id",
    element: (<ProtectedRoute ><DetailDemandeCollaborateur /> </ProtectedRoute>),
  },

  {
    path: "/collaborateur/mes-demandes", 
    element: (<ProtectedRoute><MesDemandes /> </ProtectedRoute>),
  },

  {
    path: "/technique/demandes", 
    element: (
      <ProtectedRoute requiredRole="controleur technique">
        <DashboardTechnique />
      </ProtectedRoute>
    )
  },
  {
    path: "/technique/demandes/:id",
    element: (
      <ProtectedRoute requiredRole="controleur technique">
        <DetailDemandeTechnique />
      </ProtectedRoute>
    )
  },





  // controlleur materiel

  {
    path: "/materiel/demandes-materiel",
    element: (
      <ProtectedRoute requiredRole="controleur de magasin">
        <DemandeMateriel />
      </ProtectedRoute>
    )
  },
  {
    path: "/materiel/demandes-materiel/:id",
    element: (
      <ProtectedRoute requiredRole="controleur de magasin">
        <DetailDemandeMateriel />
      </ProtectedRoute>
    )
  },
]);
