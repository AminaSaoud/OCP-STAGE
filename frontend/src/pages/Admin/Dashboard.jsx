import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../admin';
import { Users, Building2, Archive, TrendingUp, Plus, Eye } from 'lucide-react';
import { axiosClient } from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    collaborateurs: 0,
    controleursMagasin: 0,
    controleursTechnique: 0,
    archives: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [collaborateurs, magasin, technique, archives] = await Promise.all([
        axiosClient.get('/api/utilisateurs/role/collaborateur'),
        axiosClient.get('/api/utilisateurs/role/controleur de magasin'),
        axiosClient.get('/api/utilisateurs/role/controleur technique'),
        axiosClient.get('/api/utilisateurs/archives')
      ]);

      setStats({
        collaborateurs: collaborateurs.data.data?.length || 0,
        controleursMagasin: magasin.data.data?.length || 0,
        controleursTechnique: technique.data.data?.length || 0,
        archives: archives.data.data?.length || 0
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    {
      title: "Collaborateurs",
      value: stats.collaborateurs,
      description: "Utilisateurs actifs",
      icon: <Users className="w-8 h-8 text-blue-500" />,
      bg: "bg-blue-50",
      color: "text-blue-600",
      viewPath: "/admin/collaborateurs",
      addPath: "/admin/collaborateurs/ajouter"
    },
    {
      title: "Contrôleurs Magasin",
      value: stats.controleursMagasin,
      description: "Contrôleurs actifs",
      icon: <Building2 className="w-8 h-8 text-green-500" />,
      bg: "bg-green-50",
      color: "text-green-600",
      viewPath: "/admin/controleurs-magasin",
      addPath: "/admin/controleurs-magasin/ajouter"
    },
    {
      title: "Contrôleurs Technique",
      value: stats.controleursTechnique,
      description: "Contrôleurs actifs",
      icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
      bg: "bg-purple-50",
      color: "text-purple-600",
      viewPath: "/admin/controleurs-technique",
      addPath: "/admin/controleurs-technique/ajouter"
    },
    {
      title: "Archives",
      value: stats.archives,
      description: "Utilisateurs archivés",
      icon: <Archive className="w-8 h-8 text-gray-500" />,
      bg: "bg-gray-50",
      color: "text-gray-600",
      viewPath: "/admin/archives",
      addPath: null
    }
  ];

  // Date du jour
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <AdminLayout>
          <div className="space-y-6">
            {/* Barre d'accueil avec salutation et date */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                Bonjour {user?.nom || 'Dupont'} {user?.prenom || 'Alex'}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Bienvenue dans votre espace d'administration
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Date du jour</p>
                  <p className="text-lg font-semibold text-gray-800">{today}</p>
                </div>
              </div>
            </div>

        {/* Statistiques */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardStats.map((stat, index) => (
              <div key={index} className={`${stat.bg} rounded-lg p-6 shadow-sm`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </div>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
                
                {/* Boutons d'action */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(stat.viewPath)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <Eye size={14} />
                    Voir
                  </button>
                  {stat.addPath && (
                    <button
                      onClick={() => navigate(stat.addPath)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <Plus size={14} />
                      Ajouter
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;