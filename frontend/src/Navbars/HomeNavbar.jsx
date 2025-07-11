import React, { useState, useEffect } from 'react';
import { Search, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import ocp_logo_blanc from '../../public/images/ocp_logo_blanc.png';

export default function ScrollNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-lg backdrop-blur-md' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}

          <Link className="navbar-brand d-flex align-items-center" to="/">
              <img 
                src={ocp_logo_blanc} 
                alt="Logo ENSAJ Entreprises" 
                style={{ height: '50px', width: 'auto', marginRight: '10px', transition: 'opacity 0.3s ease' }} 
              />
            </Link>
         

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className={`font-medium transition-colors duration-300 ${
              isScrolled 
                ? 'text-gray-700 hover:text-green-600' 
                : 'text-white hover:text-green-200'
            }`}>
              OCP en action
            </a>
            <a href="#" className={`font-medium transition-colors duration-300 ${
              isScrolled 
                ? 'text-gray-700 hover:text-green-600' 
                : 'text-white hover:text-green-200'
            }`}>
              À propos
            </a>
            <a href="#" className={`font-medium transition-colors duration-300 ${
              isScrolled 
                ? 'text-gray-700 hover:text-green-600' 
                : 'text-white hover:text-green-200'
            }`}>
              Stratégie
            </a>
            <a href="#" className={`font-medium transition-colors duration-300 ${
              isScrolled 
                ? 'text-gray-700 hover:text-green-600' 
                : 'text-white hover:text-green-200'
            }`}>
              Produits et solutions
            </a>
            <a href="#" className={`font-medium transition-colors duration-300 ${
              isScrolled 
                ? 'text-gray-700 hover:text-green-600' 
                : 'text-white hover:text-green-200'
            }`}>
              Médias
            </a>
            <a href="/login" className={`font-medium transition-colors duration-300 ${
              isScrolled 
                ? 'text-gray-700 hover:text-green-600' 
                : 'text-white hover:text-green-200'
            }`}>
              se connecter
            </a>
          </div>

          {/* Search Icon */}
          <div className="flex items-center">
            <Search className={`w-6 h-6 cursor-pointer transition-colors duration-300 ${
              isScrolled 
                ? 'text-gray-700 hover:text-green-600' 
                : 'text-white hover:text-green-200'
            }`} />
          </div>
        </div>
      </nav>

      
     

      
    </div>
  );
}