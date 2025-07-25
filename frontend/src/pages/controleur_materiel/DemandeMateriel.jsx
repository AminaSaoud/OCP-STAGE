import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { axiosClient } from '../../api/axios';
import Layout from '../../components/Layout'; // Ajoute ceci si Layout existe

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
    <Layout>
      <div className="max-w-4xl mx-auto py-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <header className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-ocp-green mb-2">Demandes à traiter</h1>
            <p className="text-gray-600 text-lg">Espace Responsable Matériel</p>
          </header>
          {loading ? (
            <div className="text-center text-gray-700 py-12">Chargement...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-12">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-gray-50 rounded-xl text-base">
                <thead>
                  <tr className="bg-green-50 text-ocp-green">
                    <th className="border-b border-gray-200 py-3 px-4">ID</th>
                    <th className="border-b border-gray-200 py-3 px-4">Type</th>
                    <th className="border-b border-gray-200 py-3 px-4">Quantité</th>
                    <th className="border-b border-gray-200 py-3 px-4">État</th>
                    <th className="border-b border-gray-200 py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {demandes.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-400 py-10 text-lg">
                        Aucune demande à traiter.
                      </td>
                    </tr>
                  )}
                  {demandes.map(demande => (
                    <tr key={demande.id_demande} className="bg-white hover:bg-green-50 transition">
                      <td className="border-b border-gray-100 py-3 px-4 text-center font-medium">{demande.id_demande}</td>
                      <td className="border-b border-gray-100 py-3 px-4 text-center">{demande.type}</td>
                      <td className="border-b border-gray-100 py-3 px-4 text-center">{demande.quantite}</td>
                      <td className="border-b border-gray-100 py-3 px-4 text-center">
                        <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-ocp-green text-sm font-semibold">
                          {demande.etat}
                        </span>
                      </td>
                      <td className="border-b border-gray-100 py-3 px-4 text-center">
                        <Link to={`/materiel/demandes-materiel/${demande.id_demande}`} className="text-ocp-green hover:underline font-semibold">
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
    </Layout>
  );
}

export default DemandeMateriel;
