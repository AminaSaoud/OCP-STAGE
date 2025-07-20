import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { axiosClient } from '../../api/axios';
import { FileText, Loader2, AlertCircle, Eye, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const statusColors = {
  'en attente': 'bg-yellow-100 text-yellow-800',
  'approuvée': 'bg-green-100 text-green-800',
  'rejetée': 'bg-red-100 text-red-800',
  'en cours': 'bg-blue-100 text-blue-800',
};

const categoriesList = [
  'Toutes',
  'chantier',
  'informatique',
  'climatisation',
  'électroménager',
  'mobilier',
  'logistique',
  'sécurité',
  'technique',
  'autre',
];

const etatsList = [
  'Tous',
  'en_attente',
  'refuse',
  'valide_technique',
  'valide',
  'materiel_indispo',
];

const getEtatLabel = (etat) => {
  switch (etat) {
    case 'en_attente': return 'En attente';
    case 'refuse': return 'Refusé';
    case 'valide_technique': return 'Validé technique';
    case 'valide': return 'Validé';
    case 'materiel_indispo': return 'Matériel indisponible';
    default: return etat;
  }
};

const getEtatColor = (etat) => {
  switch (etat) {
    case 'en_attente': return 'bg-yellow-100 text-yellow-800';
    case 'refuse': return 'bg-red-100 text-red-800';
    case 'valide_technique': return 'bg-blue-100 text-blue-800';
    case 'valide': return 'bg-green-100 text-green-800';
    case 'materiel_indispo': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const MesDemandes = () => {
  const { user } = useAuth();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categorie, setCategorie] = useState('Toutes');
  const [etat, setEtat] = useState('Tous');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDemandes = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosClient.get('/api/demandes');
        // Correction du bug .map
        setDemandes(Array.isArray(response.data.demandes) ? response.data.demandes : []);
      } catch (err) {
        setError("Erreur lors du chargement des demandes.");
      } finally {
        setLoading(false);
      }
    };
    fetchDemandes();
  }, []);

  // Filtrage et recherche
  // Fonction de normalisation (minuscules, trim, sans accents)
  const normalize = str =>
    str
      ? str
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // enlève les accents
          .replace(/[_\-\s]/g, '') // enlève underscore, tiret, espace
      : '';

  const filteredDemandes = demandes.filter((demande) => {
    const matchCategorie = categorie === 'Toutes' || normalize(demande.categorie) === normalize(categorie);
    const matchEtat = etat === 'Tous' || (demande.etat && demande.etat === etat);
    const matchSearch =
      search.trim() === '' ||
      (demande.designation && normalize(demande.designation).includes(normalize(search))) ||
      (demande.description && normalize(demande.description).includes(normalize(search)));
    return matchCategorie && matchEtat && matchSearch;
  });

  return (
    <Layout>
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mes demandes</h1>

        {/* Filtres et recherche */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0 mb-6">
          {/* Filtre catégorie */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Catégorie</label>
            <select
              value={categorie}
              onChange={e => setCategorie(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
          {/* Filtre état */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">État</label>
            <select
              value={etat}
              onChange={e => setEtat(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {etatsList.map(et => (
                <option key={et} value={et}>{et === 'Tous' ? 'Tous' : getEtatLabel(et)}</option>
              ))}
            </select>
          </div>
          {/* Barre de recherche */}
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Recherche</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par désignation ou description..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            <span className="ml-3 text-green-700 font-medium">Chargement...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 text-red-700">
            <AlertCircle className="w-6 h-6 mr-2" /> {error}
          </div>
        ) : filteredDemandes.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p>Aucune demande trouvée.</p>
          </div>
        ) : (
          <div className="rounded-xl shadow border border-gray-200 bg-white w-full">
            <table className="min-w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/4 max-w-xs">Désignation</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Catégorie</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">État</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Détail</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredDemandes.map((demande) => (
                  <tr key={demande.id_demande}>
                    <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900 max-w-xs truncate">{demande.designation}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-700 max-w-xs truncate">{demande.description}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-700">{demande.categorie}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-500">{demande.created_at ? demande.created_at.split('T')[0] : ''}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEtatColor(demande.etat)}`}>
                        {getEtatLabel(demande.etat)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <a
                        href={`/collaborateur/demande/${demande.id_demande}`}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                        title="Voir le détail"
                      >
                        <Eye className="w-4 h-4 mr-1" /> Détail
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MesDemandes; 