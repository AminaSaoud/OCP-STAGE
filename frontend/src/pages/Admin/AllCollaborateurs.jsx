import React, { useEffect, useState } from "react";
import { axiosClient } from "../../api/axios";
import { Pencil, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../admin/components/AdminLayout";

const AllCollaborateurs = () => {
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCollaborateurs();
  }, []);

  const fetchCollaborateurs = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/api/utilisateurs/role/collaborateur");
      setCollaborateurs(res.data.data);
    } catch (err) {
      setMessage("Erreur lors du chargement des collaborateurs.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const filtered = collaborateurs.filter((c) => {
    const val = search.toLowerCase();
    return (
      c.matricule.toLowerCase().includes(val) ||
      c.nom.toLowerCase().includes(val) ||
      c.prenom.toLowerCase().includes(val)
    );
  });

  const handleDesactiver = async (id) => {
    if (!window.confirm("Désactiver ce collaborateur ?")) return;
    try {
      await axiosClient.put(`/api/utilisateurs/${id}/desactiver`);
      setCollaborateurs(collaborateurs.filter((c) => c.id_utilisateur !== id));
      setMessage("Collaborateur désactivé.");
    } catch (err) {
      setMessage("Erreur lors de la désactivation.");
    }
  };

  const handleModifier = (id) => {
    navigate(`/admin/collaborateurs/modifier/${id}`);
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Tous les collaborateurs</h2>
        {message && <div className="mb-4 text-red-600">{message}</div>}

        <div className="mb-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/admin/collaborateurs/ajouter')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md shadow mr-4"
          >
            Ajouter collaborateur
          </button>
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
                <th className="p-2">Téléphone</th>
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
                  <td colSpan={7} className="text-center p-4">Aucun collaborateur trouvé.</td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id_utilisateur} className="border-b">
                    <td className="p-2">{c.matricule}</td>
                    <td className="p-2">{c.nom}</td>
                    <td className="p-2">{c.prenom}</td>
                    <td className="p-2">{c.email}</td>
                    <td className="p-2">{c.tel}</td>
                    <td className="p-2">{c.service}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => handleModifier(c.id_utilisateur)}
                        className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded"
                        title="Modifier"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDesactiver(c.id_utilisateur)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded"
                        title="Désactiver"
                      >
                        <Trash2 size={16} />
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

export default AllCollaborateurs;