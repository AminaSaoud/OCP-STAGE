import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../admin/components/AdminLayout";
import { axiosClient } from "../../api/axios";
import { Pencil, User, Mail, Phone, Building2, CreditCard, Calendar } from "lucide-react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import frLocale from 'date-fns/locale/fr';

const VERT_OCP = "#3a7d3b";
const VERT_OCP_DARK = "#2d5f2e";

const ModifierControleurMagasin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    tel: "",
    service: "",
    fonction: "",
    matricule: "",
    cin: "",
    date_naissance: null,
    date_prise_fonction: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosClient.get(`/api/utilisateurs/${id}`);
        setForm({
          nom: res.data.nom || "",
          prenom: res.data.prenom || "",
          email: res.data.email || "",
          tel: res.data.tel || "",
          service: res.data.service || "",
          fonction: res.data.fonction || "",
          matricule: res.data.matricule || "",
          cin: res.data.cin || "",
          date_naissance: res.data.date_naissance ? new Date(res.data.date_naissance) : null,
          date_prise_fonction: res.data.date_prise_fonction ? new Date(res.data.date_prise_fonction) : null
        });
      } catch (err) {
        setMessage("Erreur lors du chargement du contrôleur de magasin.");
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id]);

  const capitalizeName = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^(06|07|05)\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateMatricule = (matricule) => {
    return matricule.length === 6 && /^[A-Z0-9]{6}$/.test(matricule.toUpperCase());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === 'nom' || name === 'prenom') {
      processedValue = capitalizeName(value);
    } else if (name === 'tel') {
      processedValue = value.replace(/\D/g, '');
      if (processedValue.length > 10) {
        processedValue = processedValue.slice(0, 10);
      }
    } else if (name === 'matricule') {
      processedValue = value.toUpperCase().slice(0, 6);
    } else if (name === 'cin') {
      processedValue = value.toUpperCase().slice(0, 20);
    }
    setForm({ ...form, [name]: processedValue });
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleDateChange = (date, name) => {
    setForm({ ...form, [name]: date });
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.matricule.trim()) {
      newErrors.matricule = "Le matricule est requis";
    } else if (!validateMatricule(form.matricule)) {
      newErrors.matricule = "Le matricule doit contenir exactement 6 caractères (lettres et chiffres)";
    }
    if (!form.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    } else if (form.nom.length < 2) {
      newErrors.nom = "Le nom doit contenir au moins 2 caractères";
    }
    if (!form.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis";
    } else if (form.prenom.length < 2) {
      newErrors.prenom = "Le prénom doit contenir au moins 2 caractères";
    }
    if (!form.cin.trim()) {
      newErrors.cin = "Le CIN est requis";
    } else if (form.cin.length < 5) {
      newErrors.cin = "Le CIN doit contenir au moins 5 caractères";
    }
    if (!form.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (!form.date_naissance) {
      newErrors.date_naissance = "La date de naissance est requise";
    } else {
      const birthDate = new Date(form.date_naissance);
      const today = new Date();
      if (birthDate >= today) {
        newErrors.date_naissance = "La date de naissance doit être antérieure à aujourd'hui";
      }
    }
    if (!form.tel.trim()) {
      newErrors.tel = "Le téléphone est requis";
    } else if (!validatePhone(form.tel)) {
      newErrors.tel = "Format de téléphone invalide (ex: 0647895263)";
    }
    if (!form.date_prise_fonction) {
      newErrors.date_prise_fonction = "La date de prise de fonction est requise";
    } else {
      const hireDate = new Date(form.date_prise_fonction);
      const today = new Date();
      if (hireDate > today) {
        newErrors.date_prise_fonction = "La date de prise de fonction ne peut pas être dans le futur";
      }
    }
    if (!form.service.trim()) {
      newErrors.service = "Le service est requis";
    }
    if (!form.fonction.trim()) {
      newErrors.fonction = "La fonction est requise";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const formData = {
        ...form,
        nom: form.nom.toUpperCase(),
        prenom: form.prenom.toUpperCase(),
        cin: form.cin.toUpperCase(),
        matricule: form.matricule.toUpperCase(),
        date_naissance: form.date_naissance ? form.date_naissance.toISOString().slice(0, 10) : null,
        date_prise_fonction: form.date_prise_fonction ? form.date_prise_fonction.toISOString().slice(0, 10) : null
      };
      await axiosClient.put(`/api/utilisateurs/${id}`, formData);
      setMessage("Contrôleur de magasin modifié avec succès !");
      setTimeout(() => navigate("/admin/controleurs-magasin"), 1200);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setMessage(err.response?.data?.message || "Erreur lors de la modification.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Carte principale avec header vert */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header vert professionnel */}
            <div 
              className="relative px-8 py-12 text-white"
              style={{ 
                background: `linear-gradient(135deg, ${VERT_OCP} 0%, ${VERT_OCP_DARK} 100%)`,
                boxShadow: '0 4px 20px rgba(58, 125, 59, 0.3)'
              }}
            >
              <div className="absolute inset-0 bg-black opacity-5"></div>
              <div className="relative flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
                    <Pencil size={36} className="text-white" />
                  </div>
                  <h1 className="text-3xl font-bold mb-2">Modifier Contrôleur de Magasin</h1>
                  <p className="text-green-100 text-lg font-medium">Gestion des Ressources Humaines</p>
                  <div className="mt-4 w-24 h-1 bg-white bg-opacity-40 rounded-full mx-auto"></div>
                </div>
              </div>
            </div>

            {/* Contenu du formulaire */}
            <div className="px-8 py-10">
              {/* Message de statut */}
              {message && (
                <div className={`mb-8 p-4 rounded-xl border-l-4 ${
                  message.includes("succès") 
                    ? "bg-green-50 text-green-800 border-green-400 shadow-green-100" 
                    : "bg-red-50 text-red-800 border-red-400 shadow-red-100"
                } shadow-lg`}>
                  <div className="flex items-center">
                    <div className="mr-3">
                      {message.includes("succès") ? "✓" : "✗"}
                    </div>
                    <div className="font-medium">{message}</div>
                  </div>
                </div>
              )}

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section Informations Personnelles */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center mb-6">
                    <User size={20} style={{ color: VERT_OCP }} className="mr-3" />
                    <h2 className="text-xl font-semibold text-gray-800">Informations Personnelles</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Matricule */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <CreditCard size={16} className="inline mr-2" />
                        Matricule *
                      </label>
                      <input
                        type="text"
                        name="matricule"
                        value={form.matricule}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                          errors.matricule 
                            ? "border-red-300 focus:ring-red-500 bg-red-50" 
                            : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                        }`}
                        placeholder="Ex: ABC123"
                        maxLength={6}
                      />
                      {errors.matricule && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <span className="mr-1">⚠</span>
                          {errors.matricule}
                        </p>
                      )}
                    </div>
                    {/* Nom */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        name="nom"
                        value={form.nom}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                          errors.nom 
                            ? "border-red-300 focus:ring-red-500 bg-red-50" 
                            : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                        }`}
                        placeholder="Nom de famille"
                      />
                      {errors.nom && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <span className="mr-1">⚠</span>
                          {errors.nom}
                        </p>
                      )}
                    </div>
                    {/* Prénom */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        name="prenom"
                        value={form.prenom}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                          errors.prenom 
                            ? "border-red-300 focus:ring-red-500 bg-red-50" 
                            : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                        }`}
                        placeholder="Prénom"
                      />
                      {errors.prenom && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <span className="mr-1">⚠</span>
                          {errors.prenom}
                        </p>
                      )}
                    </div>
                    {/* CIN */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CIN *
                      </label>
                      <input
                        type="text"
                        name="cin"
                        value={form.cin}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                          errors.cin 
                            ? "border-red-300 focus:ring-red-500 bg-red-50" 
                            : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                        }`}
                        placeholder="Numéro CIN"
                        maxLength={20}
                      />
                      {errors.cin && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <span className="mr-1">⚠</span>
                          {errors.cin}
                        </p>
                      )}
                    </div>
                    {/* Date de naissance */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Calendar size={16} className="inline mr-2" />
                        Date de naissance *
                      </label>
                      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
                        <DatePicker
                          value={form.date_naissance}
                          onChange={(date) => handleDateChange(date, 'date_naissance')}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.date_naissance,
                              helperText: errors.date_naissance,
                              sx: {
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                  height: '48px',
                                  '&:hover fieldset': {
                                    borderColor: VERT_OCP,
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: VERT_OCP,
                                  },
                                },
                              }
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                </div>

                {/* Section Contact */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center mb-6">
                    <Phone size={20} className="text-blue-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-800">Informations de Contact</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Mail size={16} className="inline mr-2" />
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                          errors.email 
                            ? "border-red-300 focus:ring-red-500 bg-red-50" 
                            : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                        }`}
                        placeholder="email@exemple.com"
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <span className="mr-1">⚠</span>
                          {errors.email}
                        </p>
                      )}
                    </div>
                    {/* Téléphone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Phone size={16} className="inline mr-2" />
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        name="tel"
                        value={form.tel}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                          errors.tel 
                            ? "border-red-300 focus:ring-red-500 bg-red-50" 
                            : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                        }`}
                        placeholder="0647895263"
                        maxLength={10}
                      />
                      {errors.tel && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <span className="mr-1">⚠</span>
                          {errors.tel}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section Professionnelle */}
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center mb-6">
                    <Building2 size={20} className="text-purple-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-800">Informations Professionnelles</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date de prise de fonction */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date de prise de fonction *
                      </label>
                      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
                        <DatePicker
                          value={form.date_prise_fonction}
                          onChange={(date) => handleDateChange(date, 'date_prise_fonction')}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.date_prise_fonction,
                              helperText: errors.date_prise_fonction,
                              sx: {
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                  height: '48px',
                                  '&:hover fieldset': {
                                    borderColor: VERT_OCP,
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: VERT_OCP,
                                  },
                                },
                              }
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </div>

                    {/* Service */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Service *
                      </label>
                      <select
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                          errors.service 
                            ? "border-red-300 focus:ring-red-500 bg-red-50" 
                            : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                        }`}
                        required
                      >
                        <option value="">-- Sélectionner un service --</option>
                        <option value="Informatique">Informatique</option>
                        <option value="RH">Ressources Humaines</option>
                        <option value="Logistique">Logistique</option>
                        <option value="Production">Production</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Achats">Achats</option>
                        <option value="Magasinier">Magasinier</option>
                        <option value="Comptabilité">Comptabilité</option>
                        <option value="Service HSO">Service HSO</option>
                      </select>
                      {errors.service && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <span className="mr-1">⚠</span>
                          {errors.service}
                        </p>
                      )}
                    </div>

                    {/* Fonction */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Fonction *
                      </label>
                      <input
                        type="text"
                        name="fonction"
                        value={form.fonction}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                          errors.fonction 
                            ? "border-red-300 focus:ring-red-500 bg-red-50" 
                            : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                        }`}
                        placeholder="Titre du poste"
                      />
                      {errors.fonction && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <span className="mr-1">⚠</span>
                          {errors.fonction}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-8 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 text-white font-medium rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5"
                    style={{ 
                      background: loading ? '#9ca3af' : `linear-gradient(135deg, ${VERT_OCP} 0%, ${VERT_OCP_DARK} 100%)`,
                    }}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enregistrement...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Pencil size={20} className="mr-2" />
                        Enregistrer les modifications
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ModifierControleurMagasin; 