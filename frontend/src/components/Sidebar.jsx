import React, { useState } from 'react';
import { 
  Home, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  ChevronDown, 
  ChevronRight,
  Building2,
  Package,
  Calendar,
  BarChart3,
  Bell,
  Mail,
  Search,
  Menu,
  X,
  User,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isOpen, onToggle }) => {
  const { user, logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const menuItems = [
    {
      key: 'dashboard',
      label: 'Tableau de bord',
      icon: Home,
      path: '/dashboard',
      badge: null
    },
    {
      key: 'demandes',
      label: 'Gestion des demandes',
      icon: FileText,
      submenu: [
        { label: 'Nouvelle demande', path: '/ajouter-demande' },
        { label: 'Mes demandes', path: '/collaborateur/mes-demandes' },
        { label: 'Toutes les demandes', path: '/toutes-demandes' }
      ]
    },
    {
      key: 'materiel',
      label: 'Gestion du matériel',
      icon: Package,
      submenu: [
        { label: 'Inventaire', path: '/inventaire' },
        { label: 'Ajouter matériel', path: '/ajouter-materiel' },
        { label: 'Historique', path: '/historique-materiel' }
      ]
    },
    {
      key: 'utilisateurs',
      label: 'Utilisateurs',
      icon: Users,
      submenu: [
        { label: 'Tous les utilisateurs', path: '/utilisateurs' },
        { label: 'Ajouter utilisateur', path: '/ajouter-utilisateur' },
        { label: 'Profils', path: '/profils' }
      ]
    },
    {
      key: 'rapports',
      label: 'Rapports & Statistiques',
      icon: BarChart3,
      submenu: [
        { label: 'Rapports mensuels', path: '/rapports-mensuels' },
        { label: 'Statistiques', path: '/statistiques' },
        { label: 'Exports', path: '/exports' }
      ]
    },
    {
      key: 'calendrier',
      label: 'Calendrier',
      icon: Calendar,
      path: '/calendrier',
      badge: 'Nouveau'
    },
    {
      key: 'parametres',
      label: 'Paramètres',
      icon: Settings,
      submenu: [
        { label: 'Profil', path: '/profil' },
        { label: 'Sécurité', path: '/securite' },
        { label: 'Notifications', path: '/notifications' }
      ]
    }
  ];

  const filteredMenuItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.submenu && item.submenu.some(sub => sub.label.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white text-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header du sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">OCP JFC4</h1>
              <p className="text-xs text-gray-500">Gestion Matériel</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Profil utilisateur */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {user?.prenom} {user?.nom}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.role === 'admin' ? 'Administrateur' : 'Collaborateur'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 sidebar-scroll">
          <ul className="space-y-1 px-3">
            {filteredMenuItems.map((item) => (
              <li key={item.key}>
                {item.submenu ? (
                  // Menu avec sous-menus
                  <div>
                    <button
                      onClick={() => toggleMenu(item.key)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap
                        ${expandedMenus[item.key] 
                          ? 'bg-green-50 text-green-700 border border-green-600' 
                          : 'bg-white text-gray-900 hover:bg-green-50 border border-transparent'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3 whitespace-nowrap">
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            {item.badge}
                          </span>
                        )}
                        {expandedMenus[item.key] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                    
                    {expandedMenus[item.key] && (
                      <ul className="mt-1 ml-6 space-y-1">
                        {item.submenu.map((subItem, index) => (
                          <li key={index}>
                            <a
                              href={subItem.path}
                              className="block px-3 py-2 text-sm bg-white text-gray-900 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-600"
                            >
                              {subItem.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  // Menu simple
                  <a
                    href={item.path}
                    className={`
                      flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors
                      bg-white text-gray-900 hover:bg-green-50 border border-transparent hover:border-green-600
                      ${window.location.pathname === item.path 
                        ? 'bg-green-50 text-green-700 border-green-600 border' 
                        : ''
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer du sidebar */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium bg-white text-gray-900 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors border border-transparent hover:border-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 