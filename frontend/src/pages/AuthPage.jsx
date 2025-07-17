import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { axiosClient } from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // 🔧 REMPLACEZ CETTE URL PAR VOTRE IMAGE DE FOND
  const backgroundImageUrl = '/images/ocp_background_home.jpg';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axiosClient.get('/sanctum/csrf-cookie');
      const response = await axiosClient.post('/api/login', {
        email,
        password
      });

      const token = response.data.token;
      const user = response.data.user;

      login(token, user);

      // redirection en fonction du rôle
      if (user.role === 'collaborateur') {
        navigate('/collaborateur/demande');
      } else if (user.role === 'controleur de magasin') {
        navigate('/magasin/dashboard');
      } else if (user.role === 'controleur technique') {
        navigate('/technique/demandes');
      }

    } catch (err) {
      console.error('Erreur login :', err);
      setError('Identifiants incorrects ou serveur indisponible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Section gauche - Bienvenue */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1 className="welcome-title">Bienvenue</h1>
            <h2 className="welcome-subtitle">chez OCP - JFC4 Magasin !</h2>
            <p className="welcome-description">
              Connectez-vous à votre espace personnel pour accéder à tous vos outils 
              et services. Votre plateforme de gestion centralisée vous attend.
            </p>
            
          {/* Logo OCP */}
            <div className="ocp-logo">
              <div className="logo-icon">
                <Link className="navbar-brand d-flex align-items-center" to="/">
               <img 
                src="/images/ocp_canva_white.png"
                alt="Logo OCP" 
                style={{ height: '70px', width: 'auto', marginRight: '10px', transition: 'opacity 0.3s ease' }} 
              />
              </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Section droite - Formulaire */}
        <div className="form-section">
          <div className="form-container">
            <h3 className="form-title">Connexion</h3>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Adresse email</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@ocp.ma"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div className="form-options">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Se souvenir de moi
                </label>
              </div>
              
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
            
            <div className="form-footer">
              <p className="info-text">
                Les comptes sont créés par l'administrateur système
              </p>
              <p className="terms-text">
                En cliquant sur "Se connecter", vous acceptez nos{' '}
                <a href="#" className="terms-link">Conditions d'utilisation</a> et notre{' '}
                <a href="#" className="terms-link">Politique de confidentialité</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`

        .ocp-logo {
          display: flex;
          justify-content: center; /* Centre horizontalement */
        }
        .login-container {
          min-height: 100vh;
          background-image: 
            linear-gradient(135deg, rgba(45, 122, 45, 0.8), rgba(96, 192, 112, 0.6)),
            url('${backgroundImageUrl}');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .login-content {
          display: flex;
          width: 100%;
          max-width: 1000px;
          min-height: 450px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }

        .welcome-section {
          flex: 1;
          background: linear-gradient(135deg, #2d7a2d, #40a050);
          color: white;
          padding: 60px 40px;
          display: flex;
          align-items: center;
          position: relative;
        }

        .welcome-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="30" r="1.5" fill="white" opacity="0.1"/><circle cx="60" cy="70" r="1" fill="white" opacity="0.1"/><circle cx="30" cy="80" r="1.5" fill="white" opacity="0.1"/><path d="M10 50 Q50 30 90 50 Q50 70 10 50" fill="none" stroke="white" stroke-width="0.5" opacity="0.1"/></svg>');
          background-size: 200px 200px;
        }

        .welcome-content {
          position: relative;
          z-index: 1;
        }

        .welcome-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 0;
          line-height: 1.1;
        }

        .welcome-subtitle {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          opacity: 0.9;
        }

        .welcome-description {
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.9;
          margin-bottom: 2rem;
          max-width: 400px;
        }

        .ocp-logo {
          margin-top: 2rem;
        }

        .logo-icon {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .logo-symbol {
          background: rgba(255, 255, 255, 0.2);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .logo-text {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
        }

        .form-section {
          flex: 1;
          padding: 60px 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .form-container {
          width: 100%;
          max-width: 400px;
        }

        .form-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2d7a2d;
          margin-bottom: 2rem;
          text-align: center;
        }

        .error-message {
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid rgba(220, 53, 69, 0.3);
          color: #721c24;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          color: #2d7a2d;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .form-input {
        color: #aaa;
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          background: white;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #40a050;
          box-shadow: 0 0 0 3px rgba(64, 160, 80, 0.1);
        }

        .form-options {
          margin-bottom: 2rem;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 0.9rem;
          color: #666;
          user-select: none;
        }

        .checkbox-container input[type="checkbox"] {
          display: none;
        }

        .checkmark {
          width: 18px;
          height: 18px;
          border: 2px solid #ddd;
          border-radius: 3px;
          margin-right: 8px;
          position: relative;
          transition: all 0.3s ease;
        }

        .checkbox-container input[type="checkbox"]:checked + .checkmark {
          background: #40a050;
          border-color: #40a050;
        }

        .checkbox-container input[type="checkbox"]:checked + .checkmark::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
          font-weight: bold;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #2d7a2d, #40a050);
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

        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .submit-btn:hover::before {
          left: 100%;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(45, 122, 45, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .form-footer {
          margin-top: 2rem;
          text-align: center;
        }

        .info-text {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .terms-text {
          color: #888;
          font-size: 0.8rem;
          line-height: 1.4;
        }

        .terms-link {
          color: #2d7a2d;
          text-decoration: none;
        }

        .terms-link:hover {
          text-decoration: underline;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .login-content {
            flex-direction: column;
            max-width: 500px;
          }

          .welcome-section {
            padding: 40px 30px;
            text-align: center;
          }

          .welcome-title,
          .welcome-subtitle {
            font-size: 2.5rem;
          }

          .form-section {
            padding: 40px 30px;
          }
        }

        @media (max-width: 480px) {
          .login-container {
            padding: 10px;
          }

          .welcome-section {
            padding: 30px 20px;
          }

          .form-section {
            padding: 30px 20px;
          }

          .welcome-title,
          .welcome-subtitle {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;