import React from 'react';
import { Search, Leaf } from 'lucide-react';
import HomeNavbar from '../Navbars/HomeNavbar';
import { axiosClient } from '../api/axios';
import { useState } from 'react';

import '../styles/main.css';

export default function Homepage() {
     const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('http://localhost:8000/api/contact', {
        email,
        message
      });
      alert("Message envoyé avec succès !");
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'envoi du message.");
    }
  };
  return (
    
        <div className="flex flex-col min-h-screen">
        <div className="relative flex-1">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
            backgroundImage: "url('/images/ocp_background_home.jpg')",
        }}
        >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>


      {/* Navbar */}
      <HomeNavbar></HomeNavbar>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="text-center">
          {/* Circular Background */}
          <div className="relative">
            <div className="w-96 h-96 rounded-full border-2 border-white border-opacity-30 flex items-center justify-center mx-auto mb-8">
              <div className="w-80 h-80 rounded-full border border-white border-opacity-20 flex items-center justify-center">
                <div className="text-center px-8">
                  <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                    Notre vision
                  </h1>
                  <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mt-2">
                    pour un avenir
                  </h2>
                  <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight mt-2">
                    durable
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex flex-col items-center text-white">
              <div className="w-px h-12 bg-white bg-opacity-50 mb-2"></div>
              <span className="text-sm uppercase tracking-wider">SCROLL</span>
              <div className="w-px h-12 bg-white bg-opacity-50 mt-2"></div>
            </div>
          </div>
        </div>
      </div>

</div>
        
<footer id="contact" className="bg-ensaj-green text-white py-8 px-4">
  <div className="max-w-6xl mx-auto">
    <div className="flex flex-col md:flex-row md:justify-between gap-8">

      {/* Bloc Adresse */}
      <div className="flex-1">
        <h5 className="text-lg font-semibold mb-3">Adresse</h5>
        <p>
          OCP GROUPE<br />
          JORF FERTILIES COMPANY JFC4<br />
          Avenue Ahmed Chaouki, El Jadida 24000<br />
          Maroc
        </p>
      </div>

      {/* Bloc Réseaux */}
      <div className="flex-1">
  <h5 className="text-lg font-semibold mb-3">Suivez-nous</h5>
  <div className="space-y-2">
    <a href="https://www.facebook.com/..." target="_blank" rel="noopener noreferrer" className="footer-link inline-flex items-center gap-2">
      <i className="fab fa-facebook"></i> Facebook
    </a><br />
    <a href="https://www.linkedin.com/..." target="_blank" rel="noopener noreferrer" className="footer-link inline-flex items-center gap-2">
      <i className="fab fa-linkedin"></i> LinkedIn
    </a><br />
    <a href="https://www.instagram.com/..." target="_blank" rel="noopener noreferrer" className="footer-link inline-flex items-center gap-2">
      <i className="fab fa-instagram"></i> Instagram
    </a>
  </div>
</div>
  
    </div>

    <hr className="my-6 border-white/20" />
    <p className="text-center text-sm">© {new Date().getFullYear()} OCP JFC4. Tous droits réservés.</p>
  </div>

  <style>{`
    .bg-ensaj-green {
  background-color: #1e4645; /* vert bleuté sérieux */
}


    .footer-link {
      color: white;
      transition: color 0.3s ease;
      text-decoration: none;
    }

    .footer-link:hover {
      color: #4db6ac;
    }

    .footer-input {
      background-color: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
    }

    .footer-input::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    .footer-button:hover {
      background-color: white;
      color: #0a1e3c;
    }
  `}</style>
</footer>


    </div>
  );
}