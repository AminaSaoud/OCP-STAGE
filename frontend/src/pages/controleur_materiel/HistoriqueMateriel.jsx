import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { FileText } from 'lucide-react';
import { axiosClient } from '../../api/axios';

function HistoriqueMateriel() {
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    axiosClient.get('/api/historique-global')
      .then(res => {
        setHistorique(res.data.historique || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Fonction utilitaire pour afficher un label lisible et stylisé selon l'état
  const getEtatLabel = (etat) => {
    switch (etat) {
      case 'en_affectation':
        return <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold">En affectation</span>;
      case 'valide':
        return <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold">Validée</span>;
      case 'valide_technique':
        return <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold">Validée technique</span>;
      case 'materiel_indispo':
        return <span className="inline-block px-3 py-1 rounded-full bg-gray-200 text-gray-800 font-semibold">Matériel indisponible</span>;
      case 'en_attente':
        return <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-800 font-semibold">En attente</span>;
      case 'refuse':
        return <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold">Refusée</span>;
      default:
        return <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-800 font-semibold">{etat}</span>;
    }
  };

  // Filtrage côté frontend
  const filteredHistorique = historique.filter(h => {
    // Filtre type
    if (typeFilter && h.type_materiel !== typeFilter) return false;
    // Filtre date
    if (dateFrom && h.created_at < dateFrom) return false;
    if (dateTo && h.created_at > dateTo + 'T23:59:59') return false;
    // Barre de recherche (désignation, matricule, code)
    const searchLower = search.toLowerCase();
    if (searchLower) {
      const cible = `${h.designation || ''} ${h.matricule || ''} ${h.code_M || ''}`.toLowerCase();
      if (!cible.includes(searchLower)) return false;
    }
    return true;
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-7 h-7 text-ocp-green" />
            <h1 className="text-2xl font-bold text-ocp-green">Historique des affectations de matériel</h1>
          </div>
          {/* Filtres */}
          <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
            <div>
              <label className="text-ocp-green font-semibold mr-2">Type :</label>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300">
                <option value="">Tous</option>
                <option value="mobilisable">Mobilisable</option>
                <option value="immobilisable">Immobilisable</option>
              </select>
            </div>
            <div>
              <label className="text-ocp-green font-semibold mr-2">Du :</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300" />
              <label className="text-ocp-green font-semibold mx-2">Au :</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300" />
            </div>
            <div className="flex-1 flex justify-end">
              <input
                type="text"
                placeholder="Recherche désignation, matricule, code..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 w-full max-w-xs"
              />
            </div>
          </div>
          {loading ? (
            <div className="text-center text-gray-700 py-12">Chargement...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-gray-50 rounded-xl text-base">
                <thead>
                  <tr className="bg-green-50 text-ocp-green">
                    <th className="border-b border-gray-200 py-2 px-3">Date</th>
                    <th className="border-b border-gray-200 py-2 px-3">Demande</th>
                    <th className="border-b border-gray-200 py-2 px-3">Catégorie</th>
                    <th className="border-b border-gray-200 py-2 px-3">Matériel</th>
                    <th className="border-b border-gray-200 py-2 px-3">Type</th>
                    <th className="border-b border-gray-200 py-2 px-3">Matricule/Code</th>
                    <th className="border-b border-gray-200 py-2 px-3">État matériel</th>
                    <th className="border-b border-gray-200 py-2 px-3">État demande</th>
                    <th className="border-b border-gray-200 py-2 px-3">Contrôleur technique</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistorique.map(h => (
                    <tr key={h.id_historique} className="bg-white hover:bg-green-50 transition">
                      <td className="border-b border-gray-100 py-2 px-3 text-center">{h.created_at?.slice(0, 10)}</td>
                      <td className="border-b border-gray-100 py-2 px-3 text-center">{h.id_demande}</td>
                      <td className="border-b border-gray-100 py-2 px-3 text-center">{h.categorie}</td>
                      <td className="border-b border-gray-100 py-2 px-3 text-center">{h.designation}</td>
                      <td className="border-b border-gray-100 py-2 px-3 text-center">{h.type_materiel}</td>
                      <td className="border-b border-gray-100 py-2 px-3 text-center">{h.type_materiel === 'immobilisable' ? h.matricule : h.code_M}</td>
                      <td className="border-b border-gray-100 py-2 px-3 text-center">{h.etat}</td>
                      <td className="border-b border-gray-100 py-2 px-3 text-center">{getEtatLabel(h.etat_demande)}</td>
                      <td className="border-b border-gray-100 py-2 px-3 text-center">{h.tech_prenom} {h.tech_nom}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default HistoriqueMateriel; 