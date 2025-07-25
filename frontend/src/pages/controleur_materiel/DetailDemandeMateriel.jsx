import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosClient } from '../../api/axios';
import Layout from '../../components/Layout'; // Ajoute ceci si Layout existe

function DetailDemandeMateriel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [demande, setDemande] = useState(null);
  const [materiels, setMateriels] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [selectedMateriels, setSelectedMateriels] = useState([]); // [{id_m, date_rec}]
  const [dateRec, setDateRec] = useState({}); // {id_m: date}
  const [historiqueMateriels, setHistoriqueMateriels] = useState([]);

  useEffect(() => {
    axiosClient.get(`/api/demandes/${id}`)
      .then(res => {
        setDemande(res.data.demande);
        setType(res.data.demande.type);
        setLoading(false);
        // Charger l'historique si en_affectation
        if (res.data.demande.etat === 'en_affectation') {
          axiosClient.get(`/api/demandes/${id}/historique-materiels`)
            .then(r => setHistoriqueMateriels(r.data.materiels || []));
        } else {
          setHistoriqueMateriels([]);
        }
      })
      .catch(() => {
        setMessage('Erreur lors du chargement de la demande.');
        setLoading(false);
      });
  }, [id]);

  const rechercherMateriel = () => {
    if (!type) return;
    setSearching(true);
    axiosClient.get('/api/materiels/recherche', {
      params: {
        type,
        q: search
      }
    })
      .then(res => setMateriels(res.data.materiels || []))
      .catch(() => setMessage('Erreur lors de la recherche de matériel.'))
      .finally(() => setSearching(false));
  };

  const handleSelectMateriel = (id_m) => {
    setSelectedMateriels(prev =>
      prev.includes(id_m)
        ? prev.filter(id => id !== id_m)
        : [...prev, id_m]
    );
  };

  const handleDateChange = (id_m, date) => {
    setDateRec(prev => ({ ...prev, [id_m]: date }));
  };

  const affecterMateriels = (validationFinale = false) => {
    const materielsAEnvoyer = selectedMateriels
      .filter(id_m => dateRec[id_m])
      .map(id_m => ({ id_m, date_rec: dateRec[id_m] }));
    if (materielsAEnvoyer.length === 0) {
      setMessage('Veuillez sélectionner au moins un matériel et une date.');
      return;
    }
    axiosClient.post(`/api/demandes/${id}/affecter-materiels`, {
      materiels: materielsAEnvoyer,
      validation_finale: validationFinale
    })
      .then(res => {
        setMessage(res.data.message);
        setTimeout(() => navigate('/materiel/demandes-materiel'), 1500);
      })
      .catch(() => setMessage("Erreur lors de l'affectation des matériels."));
  };

  const signalerIndispo = () => {
    axiosClient.post(`/api/demandes/${id}/materiel-indisponible`)
      .then(res => {
        setMessage(res.data.message);
        setTimeout(() => navigate('/materiel/demandes-materiel'), 1500);
      })
      .catch(() => setMessage('Erreur lors du signalement.'));
  };

  if (loading) return <div>Chargement...</div>;
  if (!demande) return <div>Demande introuvable.</div>;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-ocp-green mb-6 text-center">Détail de la demande</h1>
          <div className="mb-6 bg-green-50 rounded-xl p-6">
            <div className="text-gray-700"><b>ID :</b> {demande.id_demande}</div>
            <div className="text-gray-700"><b>Type :</b> {demande.type}</div>
            <div className="text-gray-700"><b>Quantité :</b> {demande.quantite}</div>
            <div className="text-gray-700"><b>Description :</b> {demande.description}</div>
            <div className="text-gray-700"><b>État :</b> {demande.etat}</div>
          </div>
          <div className="flex flex-row flex-wrap gap-4 mb-6 items-center justify-between w-full">
            <label className="text-ocp-green font-semibold flex-shrink-0">
              Filtrer par type :
              <select value={type} onChange={e => setType(e.target.value)} className="ml-2 px-3 py-2 rounded-lg border border-gray-300">
                <option value="">-- Choisir --</option>
                <option value="mobilisable">Mobilisable</option>
                <option value="immobilisable">Immobilisable</option>
              </select>
            </label>
            <input
              type="text"
              placeholder="Recherche par mot-clé..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 flex-grow min-w-[200px]"
            />
            <button
              onClick={rechercherMateriel}
              className="bg-ocp-green hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap"
              disabled={searching || !type}
            >
              {searching ? 'Recherche...' : 'Rechercher Matériel'}
            </button>
          </div>
          <ul className="mb-6 space-y-3">
            {materiels.map(m => (
              <li key={m.id_m} className="flex items-center gap-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
                <input
                  type="checkbox"
                  checked={selectedMateriels.includes(m.id_m)}
                  onChange={() => handleSelectMateriel(m.id_m)}
                  className="w-5 h-5 accent-ocp-green"
                />
                <span className="text-gray-800 font-medium">{m.designation} ({m.id_m}) - {m.type_materiel} - {m.etat}</span>
                <input
                  type="date"
                  value={dateRec[m.id_m] || ''}
                  onChange={e => handleDateChange(m.id_m, e.target.value)}
                  className="px-2 py-1 rounded-lg border border-gray-300"
                  disabled={!selectedMateriels.includes(m.id_m)}
                />
              </li>
            ))}
          </ul>
          <div className="flex gap-4 justify-center">
            <button
              onClick={signalerIndispo}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Matériel indisponible
            </button>
            <button
              onClick={() => affecterMateriels(false)}
              className="bg-ocp-green hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
              disabled={selectedMateriels.length === 0}
            >
              Affecter (en cours d'affectation)
            </button>
            <button
              onClick={() => affecterMateriels(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
              disabled={selectedMateriels.length === 0}
            >
              Valider la demande
            </button>
          </div>
          {message && <div className="mt-6 text-center text-ocp-green font-bold">{message}</div>}
        </div>
        {demande.etat === 'en_affectation' && historiqueMateriels.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-ocp-green mb-4 text-center">Matériels déjà affectés à cette demande</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-gray-50 rounded-xl text-base">
                <thead>
                  <tr className="bg-green-50 text-ocp-green">
                    <th className="border-b border-gray-200 py-2 px-3">Désignation</th>
                    <th className="border-b border-gray-200 py-2 px-3">Type</th>
                    <th className="border-b border-gray-200 py-2 px-3">Matricule/Code</th>
                    <th className="border-b border-gray-200 py-2 px-3">État</th>
                  </tr>
                </thead>
                <tbody>
                  {historiqueMateriels.map(m => (
                    <tr key={m.id_historique} className="bg-white hover:bg-green-50 transition">
                      <td className="border-b border-gray-100 py-2 px-3 text-center">{m.designation}</td>
                      <td className="border-b border-gray-100 py-2 px-3 text-center">{m.type_materiel}</td>
                      <td className="border-b border-gray-100 py-2 px-3 text-center">
                        {m.type_materiel === 'immobilisable' ? m.matricule : m.code_M}
                      </td>
                      <td className="border-b border-gray-100 py-2 px-3 text-center">{m.etat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default DetailDemandeMateriel;
