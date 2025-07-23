import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosClient } from '../../api/axios';

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
  const [dateRec, setDateRec] = useState({});

  useEffect(() => {
    axiosClient.get(`/api/demandes/${id}`)
      .then(res => {
        setDemande(res.data.demande);
        setType(res.data.demande.type); // type par défaut selon la demande
        setLoading(false);
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

  const affecterMateriel = (materielId, date) => {
    if (!materielId || !date) return;
    axiosClient.post(`/api/demandes/${id}/affecter-materiel`, {
      materiel_id: materielId,
      date_rec: date
    })
      .then(res => {
        setMessage(res.data.message);
        setTimeout(() => navigate('/materiel/demandes-materiel'), 1500);
      })
      .catch(() => setMessage("Erreur lors de l'affectation du matériel."));
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', padding: '40px 0' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', background: '#18191a', borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)', padding: 32 }}>
        <h2 style={{ color: '#00bcd4', textAlign: 'center', marginBottom: 32, letterSpacing: 1 }}>Détail de la demande</h2>
        <div style={{ color: '#fff', marginBottom: 24 }}>
          <div><b>ID :</b> {demande.id_demande}</div>
          <div><b>Type :</b> {demande.type}</div>
          <div><b>Quantité :</b> {demande.quantite}</div>
          <div><b>Description :</b> {demande.description}</div>
          <div><b>État :</b> {demande.etat}</div>
        </div>
        <div style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
          <label style={{ color: '#fff' }}>
            Filtrer par type :
            <select value={type} onChange={e => setType(e.target.value)} style={{ marginLeft: 8, padding: 4, borderRadius: 4 }}>
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
            style={{ padding: 4, borderRadius: 4, minWidth: 200 }}
          />
          <button onClick={rechercherMateriel} style={{ padding: '6px 16px', borderRadius: 4, background: '#00bcd4', color: '#fff', border: 'none', fontWeight: 500 }} disabled={searching || !type}>
            {searching ? 'Recherche...' : 'Rechercher Matériel'}
          </button>
        </div>
        <ul style={{ marginBottom: 24 }}>
          {materiels.map(m => (
            <li key={m.id_m} style={{ color: '#fff', marginBottom: 8, background: '#232526', borderRadius: 6, padding: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span><b>{m.designation}</b> ({m.id_m}) - {m.type_materiel} - {m.etat}</span>
              <input
                type="date"
                value={dateRec[m.id_m] || ''}
                onChange={e => setDateRec({ ...dateRec, [m.id_m]: e.target.value })}
                style={{ padding: 4, borderRadius: 4 }}
              />
              <button
                onClick={() => affecterMateriel(m.id_m, dateRec[m.id_m])}
                disabled={!dateRec[m.id_m]}
                style={{ padding: '6px 16px', borderRadius: 4, background: '#00bcd4', color: '#fff', border: 'none', fontWeight: 500 }}
              >
                Affecter
              </button>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', gap: 16 }}>
          <button onClick={signalerIndispo} style={{ padding: '8px 20px', borderRadius: 4, background: '#e53935', color: '#fff', border: 'none', fontWeight: 600 }}>
            Matériel indisponible
          </button>
        </div>
        {message && <div style={{ marginTop: 24, color: '#00bcd4', textAlign: 'center', fontWeight: 500 }}>{message}</div>}
      </div>
    </div>
  );
}

export default DetailDemandeMateriel;
