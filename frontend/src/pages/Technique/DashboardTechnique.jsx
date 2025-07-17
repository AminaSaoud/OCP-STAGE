import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { axiosClient } from "../../api/axios";
import Layout from "../../components/Layout";

// Mapping catégorie → importance
const importanceMap = {
  'sécurité': 1,
  'informatique': 2,
  'chantier': 2,
  'technique': 3,
  'mobilier': 4,
  'logistique': 4,
  'électroménager': 4,
  'climatisation': 4,
  'autre': 5,
};
const importanceLabel = [
  'Très haute', // 1
  'Haute',      // 2
  'Moyenne',    // 3
  'Faible',     // 4
  'Très faible' // 5
];

// Mapping couleur par catégorie
const categorieColors = {
  'sécurité': 'bg-red-100 text-red-700',
  'informatique': 'bg-blue-100 text-blue-700',
  'chantier': 'bg-yellow-100 text-yellow-700',
  'technique': 'bg-purple-100 text-purple-700',
  'mobilier': 'bg-green-100 text-green-700',
  'logistique': 'bg-pink-100 text-pink-700',
  'électroménager': 'bg-orange-100 text-orange-700',
  'climatisation': 'bg-cyan-100 text-cyan-700',
  'autre': 'bg-gray-100 text-gray-700',
};

const DashboardTechnique = () => {
  const [categorie, setCategorie] = useState("");
  const [importance, setImportance] = useState(""); // valeur: "", "1", ...
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDemandes = async () => {
    setLoading(true);
    try {
      let url = "/api/tech/demandes?";
      if (categorie) url += `categorie=${encodeURIComponent(categorie)}&`;
      // Pas de filtre importance côté backend !
      const response = await axiosClient.get(url);
      setDemandes(response.data.demandes || []);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        navigate("/"); // Redirection immédiate
        return;        // On arrête tout ici
      } else {
        setDemandes([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, [categorie, navigate]); // importance n'est pas un paramètre backend

  // Extraire les catégories distinctes des demandes pour le filtre dynamique
  const categoriesDisponibles = Array.from(
    new Set(demandes.map(d => d.categorie))
  ).filter(Boolean);

  // Filtrage par importance côté frontend
  const demandesFiltrees = importance
    ? demandes.filter(d =>
        importanceMap[d.categorie?.toLowerCase()] === parseInt(importance)
      )
    : demandes;

  const accepterDemande = async (id_demande) => {
    try {
      await axiosClient.post(`/api/tech/demandes/${id_demande}/accepter`);
      // Après acceptation, recharge la liste des demandes
      fetchDemandes();
    } catch (error) {
      alert("Erreur lors de la validation de la demande.");
    }
  };

  return (
    <Layout>
      {loading ? (
        // Tu peux mettre un loader ou même rien du tout pour que ce soit instantané
        <div></div>
      ) : (
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-600 mb-1">Catégorie</label>
              <select
                value={categorie}
                onChange={e => setCategorie(e.target.value)}
                className="rounded-lg border border-green-600 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition"
              >
                <option value="">Toutes les catégories</option>
                <option value="Sécurité">Sécurité</option>
                <option value="Informatique">Informatique</option>
                <option value="Chantier">Chantier</option>
                <option value="Technique">Technique</option>
                <option value="Mobilier">Mobilier</option>
                <option value="Logistique">Logistique</option>
                <option value="Électroménager">Électroménager</option>
                <option value="Climatisation">Climatisation</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-600 mb-1">Importance</label>
              <select
                value={importance}
                onChange={e => setImportance(e.target.value)}
                className="rounded-lg border border-green-600 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition"
              >
                <option value="">Toutes les importances</option>
                <option value="1">Très haute</option>
                <option value="2">Haute</option>
                <option value="3">Moyenne</option>
                <option value="4">Faible</option>
                <option value="5">Très faible</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
            {loading ? (
              <div className="py-12 text-center text-gray-500">Chargement...</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Demandeur</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-64 max-w-xs">
                      Désignation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Catégorie</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date de demande</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Justification</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {demandesFiltrees.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        Aucune demande trouvée.
                      </td>
                    </tr>
                  ) : (
                    demandesFiltrees.map((demande, idx) => (
                      <tr
                        key={demande.id || idx}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {demande.collaborateur
                            ? `${demande.collaborateur.prenom} ${demande.collaborateur.nom}`
                            : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 w-64 max-w-xs truncate">
                          {demande.designation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${categorieColors[demande.categorie?.toLowerCase()] || 'bg-gray-100 text-gray-700'}`}
                          >
                            {demande.categorie}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {(demande.date_creation || demande.created_at)?.slice(0, 10)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {demande.justification ? (
                            <a
                              href={`${import.meta.env.VITE_BACKEND_URL}/storage/${demande.justification}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-green-700 hover:underline"
                            >
                              Voir
                            </a>
                          ) : (
                            <span className="text-gray-400 text-xs">Aucune</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                          <Link
                            to={`/technique/demandes/${demande.id_demande}`}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            Détail
                          </Link>
                          <button
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                            onClick={() => accepterDemande(demande.id_demande)}
                          >
                            Accepter
                          </button>
                          <Link
                            to={`/technique/demandes/${demande.id_demande}`}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            Refuser
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default DashboardTechnique; 