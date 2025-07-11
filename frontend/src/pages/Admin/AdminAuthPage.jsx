import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { axiosClient } from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import ocp_canva_white from '../../../public/images/ocp_canva_white.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Image de fond pour les administrateurs
  const backgroundImageUrl = '/images/ocp_background_admin.jpg';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Admin login attempt:', { email, passwordLength: password.length });

    try {
      await axiosClient.get('/sanctum/csrf-cookie');
      const response = await axiosClient.post('/api/admin/login', {
        email,
        password
      });

      console.log('Admin login response:', response.data);

      const token = response.data.token;
      const admin = response.data.admin;

      // Stocker les informations admin avec un flag pour les distinguer
      login(token, { ...admin, isAdmin: true });

      // Redirection vers le dashboard admin
      navigate('/admin/dashboard');

    } catch (err) {
      console.error('Erreur login admin :', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        if (errors?.email) {
          setError(errors.email[0]);
        } else {
          setError('Erreur de validation des données.');
        }
      } else {
        setError('Identifiants administrateur incorrects ou serveur indisponible.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-content">
        {/* Section gauche - Bienvenue Admin */}
        <div className="admin-welcome-section">
          <div className="admin-welcome-content">
            <h1 className="admin-welcome-title">Espace</h1>
            <h2 className="admin-welcome-subtitle">Administrateur</h2>
            <p className="admin-welcome-description">
              Accédez à votre tableau de bord administrateur pour gérer le système, 
              les utilisateurs et superviser toutes les opérations de la plateforme OCP.
            </p>
            
            {/* Logo OCP */}
            <div className="admin-ocp-logo">
              <div className="admin-logo-icon">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                <img 
                  src={ocp_canva_white} 
                  alt="Logo OCP Admin" 
                  style={{ height: '70px', width: 'auto', marginRight: '10px', transition: 'opacity 0.3s ease' }} 
                />
                </Link>
              </div>
            </div>
            
            {/* Badge Admin */}
            <div className="admin-badge">
              <span className="admin-badge-icon">🛡️</span>
              <span className="admin-badge-text">ACCÈS ADMINISTRATEUR</span>
            </div>
          </div>
        </div>

        {/* Section droite - Formulaire Admin */}
        <div className="admin-form-section">
          <div className="admin-form-container">
            <h3 className="admin-form-title">Connexion Administrateur</h3>
            
            {error && (
              <div className="admin-error-message">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label htmlFor="email">Adresse email administrateur</label>
                <input
                  type="email"
                  id="email"
                  className="admin-form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ocp.ma"
                  required
                />
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  className="admin-form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div className="admin-form-options">
                <label className="admin-checkbox-container">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="admin-checkmark"></span>
                  Se souvenir de moi
                </label>
              </div>
              
              <button
                type="submit"
                className="admin-submit-btn"
                disabled={loading}
              >
                {loading ? 'Connexion...' : 'Accéder à l\'administration'}
              </button>
            </form>
            
            <div className="admin-form-footer">
              <p className="admin-info-text">
                ⚠️ Accès réservé aux administrateurs système uniquement
              </p>
              <div className="admin-links">
                <a href="/login" className="admin-user-link">
                  Connexion utilisateur standard
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .admin-ocp-logo {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .admin-login-container {
          min-height: 100vh;
          background-image: 
            linear-gradient(135deg, rgba(139, 69, 19, 0.85), rgba(160, 82, 45, 0.7)),
            url('${backgroundImageUrl}');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .admin-login-content {
          display: flex;
          width: 100%;
          max-width: 1000px;
          min-height: 450px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          border: 2px solid rgba(139, 69, 19, 0.2);
        }

        .admin-welcome-section {
          flex: 1;
          background: linear-gradient(135deg, #8B4513, #A0522D);
          color: white;
          padding: 60px 40px;
          display: flex;
          align-items: center;
          position: relative;
        }

        .admin-welcome-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="30" r="1.5" fill="white" opacity="0.1"/><circle cx="60" cy="70" r="1" fill="white" opacity="0.1"/><circle cx="30" cy="80" r="1.5" fill="white" opacity="0.1"/><polygon points="50,10 60,30 40,30" fill="white" opacity="0.1"/><rect x="45" y="70" width="10" height="10" fill="white" opacity="0.1"/></svg>');
          background-size: 200px 200px;
        }

        .admin-welcome-content {
          position: relative;
          z-index: 1;
        }

        .admin-welcome-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 0;
          line-height: 1.1;
        }

        .admin-welcome-subtitle {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          opacity: 0.9;
        }

        .admin-welcome-description {
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.9;
          margin-bottom: 2rem;
          max-width: 400px;
        }

        .admin-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.15);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 25px;
          padding: 10px 20px;
          margin-top: 1rem;
          backdrop-filter: blur(10px);
        }

        .admin-badge-icon {
          font-size: 1.2rem;
          margin-right: 8px;
        }

        .admin-badge-text {
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .admin-form-section {
          flex: 1;
          padding: 60px 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-form-container {
          width: 100%;
          max-width: 400px;
        }

        .admin-form-title {
          font-size: 2rem;
          font-weight: 700;
          color: #8B4513;
          margin-bottom: 2rem;
          text-align: center;
        }

        .admin-error-message {
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid rgba(220, 53, 69, 0.3);
          color: #721c24;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          text-align: center;
        }

        .admin-form-group {
          margin-bottom: 1.5rem;
        }

        .admin-form-group label {
          display: block;
          color: #8B4513;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .admin-form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          color: #333;
          background: white;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .admin-form-input:focus {
          outline: none;
          border-color: #A0522D;
          box-shadow: 0 0 0 3px rgba(160, 82, 45, 0.1);
        }

        .admin-form-options {
          margin-bottom: 2rem;
        }

        .admin-checkbox-container {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 0.9rem;
          color: #666;
          user-select: none;
        }

        .admin-checkbox-container input[type="checkbox"] {
          display: none;
        }

        .admin-checkmark {
          width: 18px;
          height: 18px;
          border: 2px solid #ddd;
          border-radius: 3px;
          margin-right: 8px;
          position: relative;
          transition: all 0.3s ease;
        }

        .admin-checkbox-container input[type="checkbox"]:checked + .admin-checkmark {
          background: #A0522D;
          border-color: #A0522D;
        }

        .admin-checkbox-container input[type="checkbox"]:checked + .admin-checkmark::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
          font-weight: bold;
        }

        .admin-submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #8B4513, #A0522D);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .admin-submit-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .admin-submit-btn:hover::before {
          left: 100%;
        }

        .admin-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(139, 69, 19, 0.3);
        }

        .admin-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .admin-form-footer {
          margin-top: 2rem;
          text-align: center;
        }

        .admin-info-text {
          color: #dc3545;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .admin-links {
          margin-top: 1rem;
        }

        .admin-user-link {
          color: #8B4513;
          text-decoration: none;
          font-size: 0.9rem;
          padding: 8px 16px;
          border: 1px solid #8B4513;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .admin-user-link:hover {
          background: #8B4513;
          color: white;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .admin-login-content {
            flex-direction: column;
            max-width: 500px;
          }

          .admin-welcome-section {
            padding: 40px 30px;
            text-align: center;
          }

          .admin-welcome-title,
          .admin-welcome-subtitle {
            font-size: 2.5rem;
          }

          .admin-form-section {
            padding: 40px 30px;
          }
        }

        @media (max-width: 480px) {
          .admin-login-container {
            padding: 10px;
          }

          .admin-welcome-section {
            padding: 30px 20px;
          }

          .admin-form-section {
            padding: 30px 20px;
          }

          .admin-welcome-title,
          .admin-welcome-subtitle {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;