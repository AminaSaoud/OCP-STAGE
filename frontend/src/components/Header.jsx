import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  Mail, 
  Search, 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    {
      id: 1,
      type: 'success',
      message: 'Votre demande de matériel a été approuvée',
      time: 'Il y a 5 min',
      icon: '✓'
    },
    {
      id: 2,
      type: 'info',
      message: 'Nouveau matériel disponible',
      time: 'Il y a 1 heure',
      icon: '📦'
    },
    {
      id: 3,
      type: 'warning',
      message: 'Rappel: Inventaire prévu demain',
      time: 'Il y a 2 heures',
      icon: '⚠️'
    }
  ];

  const messages = [
    {
      id: 1,
      from: 'Admin OCP',
      subject: 'Mise à jour du système',
      time: 'Il y a 10 min',
      avatar: '👤'
    },
    {
      id: 2,
      from: 'Service IT',
      subject: 'Maintenance prévue',
      time: 'Il y a 1 heure',
      avatar: '🔧'
    }
  ];

  return (
    <header className="bg-white text-gray-900 shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Bouton menu et recherche */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Barre de recherche */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Actions utilisateur */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowMessages(false);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-lg bg-white text-gray-900 hover:bg-green-50 transition-colors border border-gray-200"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            </button>

            {/* Dropdown notifications */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm">
                          {notification.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200">
                  <a href="/notifications" className="text-sm text-green-600 hover:text-green-700 font-medium">
                    Voir toutes les notifications
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="relative">
            <button
              onClick={() => {
                setShowMessages(!showMessages);
                setShowNotifications(false);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-lg bg-white text-gray-900 hover:bg-green-50 transition-colors border border-gray-200"
            >
              <Mail className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                {messages.length}
              </span>
            </button>

            {/* Dropdown messages */}
            {showMessages && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-800">Messages</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {messages.map((message) => (
                    <div key={message.id} className="p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">
                          {message.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">{message.from}</p>
                          <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                          <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200">
                  <a href="/messages" className="text-sm text-green-600 hover:text-green-700 font-medium">
                    Voir tous les messages
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Profil utilisateur */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
                setShowMessages(false);
              }}
              className="flex items-center space-x-2 p-2 rounded-lg bg-white text-gray-900 hover:bg-green-50 transition-colors border border-gray-200"
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-green-600" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'admin' ? 'Administrateur' : 'Collaborateur'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Dropdown profil */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-2">
                  <a
                    href="/profil"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4" />
                    <span>Mon profil</span>
                  </a>
                  <a
                    href="/parametres"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Paramètres</span>
                  </a>
                  <hr className="my-2" />
                  <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay pour fermer les dropdowns */}
      {(showNotifications || showMessages || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowMessages(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
};

export default Header; 