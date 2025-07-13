import React from 'react';
import Layout from '../components/Layout';
import { 
  FileText, 
  Package, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Demandes en cours',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Matériel disponible',
      value: '156',
      change: '+5%',
      changeType: 'positive',
      icon: Package,
      color: 'green'
    },
    {
      title: 'Utilisateurs actifs',
      value: '89',
      change: '+8%',
      changeType: 'positive',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Taux d\'approbation',
      value: '94%',
      change: '+2%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  const recentDemandes = [
    {
      id: 'DEM-001',
      user: 'Ahmed Benali',
      type: 'Informatique',
      status: 'En attente',
      date: '2024-01-15',
      priority: 'Moyenne'
    },
    {
      id: 'DEM-002',
      user: 'Fatima Zahra',
      type: 'Mobilier',
      status: 'Approuvée',
      date: '2024-01-14',
      priority: 'Haute'
    },
    {
      id: 'DEM-003',
      user: 'Mohammed Alami',
      type: 'Technique',
      status: 'En cours',
      date: '2024-01-13',
      priority: 'Basse'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approuvée':
        return 'bg-green-100 text-green-800';
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejetée':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Haute':
        return 'bg-red-100 text-red-800';
      case 'Moyenne':
        return 'bg-yellow-100 text-yellow-800';
      case 'Basse':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600">Bienvenue dans votre espace de gestion OCP JFC4</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs mois dernier</span>
              </div>
            </div>
          ))}
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Demandes récentes */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Demandes récentes</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentDemandes.map((demande) => (
                  <div key={demande.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{demande.id}</p>
                        <p className="text-sm text-gray-600">{demande.user}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(demande.status)}`}>
                        {demande.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(demande.priority)}`}>
                        {demande.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <a href="/toutes-demandes" className="text-green-600 hover:text-green-700 font-medium">
                  Voir toutes les demandes →
                </a>
              </div>
            </div>
          </div>

          {/* Activité récente */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Activité récente</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Demande approuvée</p>
                    <p className="text-xs text-gray-500">DEM-002 a été approuvée</p>
                    <p className="text-xs text-gray-400">Il y a 2 heures</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Nouveau matériel</p>
                    <p className="text-xs text-gray-500">5 ordinateurs ajoutés</p>
                    <p className="text-xs text-gray-400">Il y a 4 heures</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Maintenance prévue</p>
                    <p className="text-xs text-gray-500">Inventaire demain</p>
                    <p className="text-xs text-gray-400">Il y a 6 heures</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Évolution des demandes</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Graphique des demandes</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Répartition par catégorie</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Graphique des catégories</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 