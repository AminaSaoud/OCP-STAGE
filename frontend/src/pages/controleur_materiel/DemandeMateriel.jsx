import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { axiosClient } from '../../api/axios';

function DemandeMateriel() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axiosClient.get('/api/demandes-a-traiter')
      .then(res => {
        const data = res.data.demandes || [];
        setDemandes(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur lors du chargement des demandes.');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', padding: '40px 0' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', background: '#18191a', borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)', padding: 32 }}>
        <h2 style={{ color: '#00bcd4', textAlign: 'center', marginBottom: 32, letterSpacing: 1 }}>Demandes à traiter (Responsable Matériel)</h2>
        {loading ? (
          <div style={{ color: '#fff', textAlign: 'center', padding: 32 }}>Chargement...</div>
        ) : error ? (
          <div style={{ color: 'red', textAlign: 'center', padding: 32 }}>{error}</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#232526', color: '#fff', borderRadius: 8, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#222', color: '#00bcd4' }}>
                  <th style={{ border: '1px solid #333', padding: '12px 8px' }}>ID</th>
                  <th style={{ border: '1px solid #333', padding: '12px 8px' }}>Type</th>
                  <th style={{ border: '1px solid #333', padding: '12px 8px' }}>Quantité</th>
                  <th style={{ border: '1px solid #333', padding: '12px 8px' }}>État</th>
                  <th style={{ border: '1px solid #333', padding: '12px 8px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {demandes.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: '#aaa', padding: 32 }}>
                      Aucune demande à traiter.
                    </td>
                  </tr>
                )}
                {demandes.map(demande => (
                  <tr key={demande.id_demande} style={{ background: '#232526', transition: 'background 0.2s' }}>
                    <td style={{ border: '1px solid #333', padding: '10px 8px', textAlign: 'center' }}>{demande.id_demande}</td>
                    <td style={{ border: '1px solid #333', padding: '10px 8px', textAlign: 'center' }}>{demande.type}</td>
                    <td style={{ border: '1px solid #333', padding: '10px 8px', textAlign: 'center' }}>{demande.quantite}</td>
                    <td style={{ border: '1px solid #333', padding: '10px 8px', textAlign: 'center' }}>{demande.etat}</td>
                    <td style={{ border: '1px solid #333', padding: '10px 8px', textAlign: 'center' }}>
                      <Link to={`/materiel/demandes-materiel/${demande.id_demande}`} style={{ color: '#00bcd4', textDecoration: 'underline', fontWeight: 500 }}>
                        Détail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DemandeMateriel;
