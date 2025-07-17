import React, { useEffect, useState } from "react";
import { axiosClient } from "../../api/axios";
import { Search, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../admin/components/AdminLayout";

const Archives = () => {
  const [archives, setArchives] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchArchives();
  }, []);

  const fetchArchives = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/api/utilisateurs/archives");
      setArchives(res.data.data);
    } catch (err) {
      setMessage("Erreur lors du chargement des archives.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = archives.filter((a) => {
    const val = search.toLowerCase();
    return (
      a.matricule.toLowerCase().includes(val) ||
      a.nom.toLowerCase().includes(val) ||
      a.prenom.toLowerCase().includes(val) ||
      a.role.toLowerCase().includes(val)
    );
  });

  const handleReactiver = async (id) => {
    if (!window.confirm("Réactiver cet utilisateur ?")) return;
    try {
      await axiosClient.put(`/api/utilisateurs/${id}/reactiver`);
      setArchives(archives.filter((a) => a.id_utilisateur !== id));
      setMessage("Utilisateur réactivé avec succès.");
    } catch (err) {
      setMessage("Erreur lors de la réactivation.");
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Archives - Utilisateurs Désactivés</h2>
        {message && <div className="mb-4 text-green-600">{message}</div>}

        <div className="mb-4 flex justify-between items-center">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Matricule</th>
                <th className="p-2">Nom</th>
                <th className="p-2">Prénom</th>
                <th className="p-2">Email</th>
                <th className="p-2">Rôle</th>
                <th className="p-2">Service</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center p-4">Chargement...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-4">Aucun utilisateur archivé trouvé.</td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id_utilisateur} className="border-b">
                    <td className="p-2">{a.matricule}</td>
                    <td className="p-2">{a.nom}</td>
                    <td className="p-2">{a.prenom}</td>
                    <td className="p-2">{a.email}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        a.role === 'collaborateur' ? 'bg-blue-100 text-blue-800' :
                        a.role === 'controleur de magasin' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {a.role}
                      </span>
                    </td>
                    <td className="p-2">{a.service}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleReactiver(a.id_utilisateur)}
                        className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded"
                        title="Réactiver"
                      >
                        <RotateCcw size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Archives; 