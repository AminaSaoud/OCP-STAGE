import React, { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForceChangePassword() {
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (form.new_password !== form.new_password_confirmation) {
      setError("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    try {
      // Remplace par la vraie façon de récupérer l'email de l'utilisateur
      const email = localStorage.getItem("forceChangeEmail"); 

      const response = await axios.post("http://localhost:8000/api/force-change-password", {
        email,
        old_password: form.old_password,
        new_password: form.new_password,
        new_password_confirmation: form.new_password_confirmation,
      });

      setSuccess("Mot de passe modifié avec succès !");
      setIsLoading(false);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Erreur lors du changement de mot de passe"
      );
      setIsLoading(false);
    }
  };

  const passwordCriteria = [
    { met: form.new_password.length >= 8, text: "Au moins 8 caractères" },
    { met: /[A-Z]/.test(form.new_password), text: "Une lettre majuscule" },
    { met: /[a-z]/.test(form.new_password), text: "Une lettre minuscule" },
    { met: /\d/.test(form.new_password), text: "Un chiffre" },
    { met: /[@$!%*#?&]/.test(form.new_password), text: "Un caractère spécial" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="bg-white shadow-xl rounded-2xl border border-green-200 overflow-hidden">
          {/* Header */}
          <div className="bg-[#00853F] p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <FaShieldAlt className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Changement de mot de passe
            </h1>
            <p className="text-green-100 text-sm">
              Pour votre sécurité, veuillez mettre à jour votre mot de passe
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl mb-6 flex items-center space-x-3">
                <FaExclamationTriangle className="text-red-500" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-4 rounded-xl mb-6 flex items-center space-x-3">
                <FaCheckCircle className="text-green-500" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Ancien mot de passe */}
              <div>
                <label className="block text-gray-700 text-sm font-medium">
                  Ancien mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showOld ? "text" : "password"}
                    name="old_password"
                    value={form.old_password}
                    onChange={handleChange}
                    required
                    className="w-full border border-green-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00853F] focus:border-[#00853F] bg-gray-50"
                    placeholder="Entrez votre ancien mot de passe"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00853F]"
                    onClick={() => setShowOld(!showOld)}
                  >
                    {showOld ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Nouveau mot de passe */}
              <div>
                <label className="block text-gray-700 text-sm font-medium">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    name="new_password"
                    value={form.new_password}
                    onChange={handleChange}
                    required
                    className="w-full border border-green-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00853F] focus:border-[#00853F] bg-gray-50"
                    placeholder="Créez un nouveau mot de passe"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00853F]"
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Critères */}
              {form.new_password && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-[#00853F] mb-3 flex items-center">
                    <FaLock className="mr-2" />
                    Critères de sécurité
                  </p>
                  <ul className="space-y-2">
                    {passwordCriteria.map((criterion, index) => (
                      <li
                        key={index}
                        className={`text-xs ${
                          criterion.met
                            ? "text-green-700 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        {criterion.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Confirmer mot de passe */}
              <div>
                <label className="block text-gray-700 text-sm font-medium">
                  Confirmer le nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="new_password_confirmation"
                    value={form.new_password_confirmation}
                    onChange={handleChange}
                    required
                    className="w-full border border-green-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00853F] focus:border-[#00853F] bg-gray-50"
                    placeholder="Confirmez votre nouveau mot de passe"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00853F]"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Bouton */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#00853F] hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
              >
                {isLoading ? "Mise à jour..." : "Changer le mot de passe"}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-green-50 border-t border-green-200 p-4">
            <p className="text-xs text-green-700 text-center">
              © {new Date().getFullYear()} OCP - JFC4 Magasin
            </p>
          </div>
        </div>

        {/* Security notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-green-700 bg-green-100 rounded-lg px-4 py-2 border border-green-200">
            🔒 Connexion sécurisée • Protection des données garantie
          </p>
        </div>
      </div>
    </div>
  );
}