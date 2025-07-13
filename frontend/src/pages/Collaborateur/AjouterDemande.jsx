import { useState } from 'react';
import { Send, FileText, AlertCircle, CheckCircle, Upload, X, Building2, Package, FileCheck } from 'lucide-react';
import { axiosClient } from '../../api/axios';
import Layout from '../../components/Layout';

const DemandeForm = () => {
  const [formData, setFormData] = useState({
    categorie: '',
    designation: '',
    description: '',
    justification_file: null
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    { value: 'chantier', label: 'Chantier', icon: Building2 },
    { value: 'informatique', label: 'Informatique', icon: Package },
    { value: 'climatisation', label: 'Climatisation', icon: Package },
    { value: 'électroménager', label: 'Électroménager', icon: Package },
    { value: 'mobilier', label: 'Mobilier', icon: Package },
    { value: 'logistique', label: 'Logistique', icon: Package },
    { value: 'sécurité', label: 'Sécurité', icon: Package },
    { value: 'technique', label: 'Technique', icon: Package },
    { value: 'autre', label: 'Autre', icon: Package }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Le fichier ne doit pas dépasser 5MB' });
        return;
      }
      
      // Vérifier le type de fichier
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
                           'application/vnd.ms-excel', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!allowedTypes.includes(file.type)) {
        setMessage({ type: 'error', text: 'Type de fichier non supporté. Utilisez PDF, Excel ou Word.' });
        return;
      }

      setFormData(prev => ({
        ...prev,
        justification_file: file
      }));
      setMessage({ type: '', text: '' });
    }
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      justification_file: null
    }));
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileChange({ target: { files: [file] } });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (!formData.categorie || !formData.designation || !formData.description || !formData.justification_file) {
      setMessage({ type: 'error', text: 'Veuillez remplir tous les champs obligatoires' });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({ type: 'error', text: 'Vous devez être connecté pour soumettre une demande' });
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('categorie', formData.categorie);
      formDataToSend.append('designation', formData.designation);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('justification_file', formData.justification_file);

      const response = await axiosClient.post('/api/demandes', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      const data = response.data;

      if (data.success) {
        setMessage({ type: 'success', text: `Demande soumise avec succès! ID: ${data.id_demande}` });
        setFormData({
          categorie: '',
          designation: '',
          description: '',
          justification_file: null
        });
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      } else {
        setMessage({ type: 'error', text: data.message || 'Erreur lors de la soumission' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header avec logo OCP */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Nouvelle Demande de Matériel</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Soumettez votre demande de matériel en remplissant le formulaire ci-dessous. 
            Tous les champs marqués d'un astérisque (*) sont obligatoires.
          </p>
        </div>

        {/* Message d'alerte */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl border-l-4 flex items-start space-x-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-500 text-green-800' 
              : 'bg-red-50 border-red-500 text-red-800'
          }`}>
            {message.type === 'success' ? 
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" /> : 
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            }
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Formulaire principal */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Informations de la demande
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Catégorie */}
            <div className="space-y-2">
              <label htmlFor="categorie" className="block text-sm font-semibold text-gray-700">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="categorie"
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Désignation */}
            <div className="space-y-2">
              <label htmlFor="designation" className="block text-sm font-semibold text-gray-700">
                Désignation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                required
                maxLength={191}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                placeholder="Ex: Ordinateur portable, Chaise de bureau, Imprimante..."
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                Description détaillée <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-vertical"
                placeholder="Décrivez en détail le matériel demandé, ses spécifications, la raison de la demande..."
              />
            </div>

            {/* Justification */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Justification <span className="text-red-500">*</span>
              </label>
              
              {formData.justification_file ? (
                <div className="border-2 border-green-200 bg-green-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileCheck className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">{formData.justification_file.name}</p>
                        <p className="text-sm text-green-600">
                          {(formData.justification_file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    dragActive 
                      ? 'border-green-500 bg-green-50 scale-105' 
                      : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2 font-medium">
                    Glissez-déposez votre fichier ici ou
                  </p>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.xlsx,.xls,.doc,.docx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <button
                    type="button"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    Choisir un fichier
                  </button>
                  <p className="text-xs text-gray-500 mt-3">
                    Formats acceptés: PDF, Excel, Word (max 5MB)
                  </p>
                </div>
              )}
            </div>

            {/* Bouton de soumission */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl text-white font-semibold text-lg transition-all duration-200 transform ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Soumission en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    <span>Soumettre la demande</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer informatif */}
        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Informations importantes</h3>
            <p className="text-sm text-blue-700">
              Votre demande sera traitée dans les plus brefs délais. 
              Vous recevrez une notification par email une fois votre demande validée.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DemandeForm;