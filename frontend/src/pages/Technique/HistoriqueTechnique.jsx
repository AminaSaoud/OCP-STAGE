import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { FileText, X } from 'lucide-react';
import { axiosClient } from '../../api/axios';

function HistoriqueTechnique() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  useEffect(() => {
    axiosClient.get('/api/tech/historique')
      .then(res => {
        setDemandes(res.data.demandes || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Frontend filtering
  const filteredDemandes = demandes.filter(d => {
    if (dateFrom && d.date_demande < dateFrom) return false;
    if (dateTo && d.date_demande > dateTo + 'T23:59:59') return false;
    if (search) {
      const cible = `${d.id_demande || ''} ${d.categorie || ''} ${d.tech_prenom || ''} ${d.tech_nom || ''}`.toLowerCase();
      if (!cible.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const openDetail = (id) => {
    setDetailLoading(true);
    setDetailError('');
    axiosClient.get(`/api/demandes/${id}`)
      .then(res => {
        setSelectedDemande(res.data.demande);
        setDetailLoading(false);
      })
      .catch(() => {
        setDetailError('Erreur lors du chargement du détail.');
        setDetailLoading(false);
      });
  };

  const closeDetail = () => {
    setSelectedDemande(null);
    setDetailError('');
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-7 h-7 text-ocp-green" />
            <h1 className="text-2xl font-bold text-ocp-green">Historique des demandes validées techniquement</h1>
          </div>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
            <div>
              <label className="text-ocp-green font-semibold mr-2">Du :</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300" />
              <label className="text-ocp-green font-semibold mx-2">Au :</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300" />
            </div>
            <div className="flex-1 flex justify-end">
              <input
                type="text"
                placeholder="Recherche demande, catégorie, contrôleur..."
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
                    <th className="border-b border-gray-200 py-2 px-3">ID Demande</th>
                    <th className="border-b border-gray-200 py-2 px-3">Catégorie</th>
                    <th className="border-b border-gray-200 py-2 px-3">Contrôleur technique</th>
                    <th className="border-b border-gray-200 py-2 px-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDemandes.map(d => (
                    <tr key={d.id_demande} className="bg-white hover:bg-green-50 transition">
                      <td className="border-b border-gray-100 py-2 px-3 text-center">{d.date_demande?.slice(0, 10)}</td>
                      <td className="border-b border-gray-100 py-2 px-3 text-center">{d.id_demande}</td>
                      <td className="border-b border-gray-100 py-2 px-3 text-center">{d.categorie}</td>
                      <td className="border-b border-gray-100 py-2 px-3 text-center">{d.tech_prenom} {d.tech_nom}</td>
                      <td className="border-b border-gray-100 py-2 px-3 text-center">
                        <button
                          className="bg-ocp-green hover:bg-green-700 text-white px-4 py-1 rounded-lg font-semibold transition"
                          onClick={() => openDetail(d.id_demande)}
                        >
                          Détail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de détail */}
        {selectedDemande && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-[#f8faf5] rounded-[2.5rem] shadow-xl border border-ocp-green/30 p-0 max-w-3xl w-full relative animate-fade-in scale-100 transition-transform duration-200">
              {/* Header modernisé */}
              <div className="flex items-center justify-between px-14 py-10 rounded-t-[2.5rem] bg-gradient-to-r from-[#256029] to-[#145214]">
                <h2 className="text-3xl font-extrabold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.55)] tracking-wide flex items-center gap-4">
                  <FileText className="w-8 h-8 drop-shadow-lg" />
                  Détail de la demande
                </h2>
                <button
                  className="rounded-full bg-white/20 hover:bg-ocp-green/80 text-white transition p-2 flex items-center justify-center"
                  onClick={closeDetail}
                  aria-label="Fermer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="px-14 py-10">
                {detailLoading ? (
                  <div className="text-center text-gray-700 py-8">Chargement...</div>
                ) : detailError ? (
                  <div className="text-center text-red-600 py-8">{detailError}</div>
                ) : (
                  <>
                    {/* Désignation en haut, style OCP */}
                    <div className="mb-8">
                      <div className="text-xl font-semibold text-ocp-green mb-1 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-ocp-green" />
                        {selectedDemande.designation}
                      </div>
                    </div>
                    <hr className="my-6 border-green-100" />
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-gray-700 text-lg">
                      <div><span className="font-semibold text-ocp-green">Type :</span> {selectedDemande.type}</div>
                      <div><span className="font-semibold text-ocp-green">Catégorie :</span> {selectedDemande.categorie}</div>
                      <div className="col-span-2 flex items-center"><span className="font-semibold text-ocp-green mr-2">Description :</span> <span className="italic text-gray-800">{selectedDemande.description}</span></div>
                      <div><span className="font-semibold text-ocp-green">Quantité :</span> {selectedDemande.quantite}</div>
                      <div><span className="font-semibold text-ocp-green">État :</span> {selectedDemande.etat}</div>
                      <div><span className="font-semibold text-ocp-green">Date de demande :</span> {selectedDemande.date_demande?.slice(0, 10)}</div>
                      <div><span className="font-semibold text-ocp-green">Contrôleur technique :</span> {selectedDemande.tech_prenom} {selectedDemande.tech_nom}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default HistoriqueTechnique; 