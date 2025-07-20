import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosClient } from "../../api/axios";
import Layout from "../../components/Layout";
import { XCircle, CheckCircle, Clock, Info } from "lucide-react";

const categoryIcons = {
  informatique: <svg className="w-14 h-14 text-blue-500 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="#dbeafe" /><path d="M8 20h8M12 16v4" stroke="currentColor" strokeWidth="2" /></svg>,
  securite: <svg className="w-14 h-14 text-red-500 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 3l8 4v5c0 5.25-3.5 10-8 10S4 17.25 4 12V7l8-4z" fill="#fee2e2" stroke="currentColor" strokeWidth="2" /></svg>,
  chantier: <svg className="w-14 h-14 text-yellow-500 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="8" rx="2" fill="#fef9c3" stroke="currentColor" strokeWidth="2" /><path d="M2 18h20" stroke="currentColor" strokeWidth="2" /></svg>,
  technique: <svg className="w-14 h-14 text-purple-500 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ede9fe" stroke="currentColor" strokeWidth="2" /><path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" /></svg>,
  mobilier: <svg className="w-14 h-14 text-green-500 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="7" rx="2" fill="#bbf7d0" stroke="currentColor" strokeWidth="2" /><path d="M8 17v2M16 17v2" stroke="currentColor" strokeWidth="2" /></svg>,
  logistique: <svg className="w-14 h-14 text-pink-500 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2" fill="#fce7f3" stroke="currentColor" strokeWidth="2" /><circle cx="7" cy="17" r="2" fill="#f9a8d4" /><circle cx="17" cy="17" r="2" fill="#f9a8d4" /></svg>,
  electromenager: <svg className="w-14 h-14 text-orange-500 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="4" width="12" height="16" rx="2" fill="#ffedd5" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="18" r="1" fill="#fdba74" /></svg>,
  climatisation: <svg className="w-14 h-14 text-cyan-500 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="10" rx="2" fill="#cffafe" stroke="currentColor" strokeWidth="2" /><path d="M8 17v2M16 17v2" stroke="currentColor" strokeWidth="2" /></svg>,
  autre: <svg className="w-14 h-14 text-gray-400 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#f3f4f6" stroke="currentColor" strokeWidth="2" /><text x="12" y="16" textAnchor="middle" fontSize="10" fill="#9ca3af">?</text></svg>,
};

const categoryTheme = {
  informatique: {
    main: "blue-500",
    bg: "from-blue-100 to-blue-50",
    badge: "bg-blue-100 text-blue-700 border-blue-300",
    border: "border-blue-300"
  },
  securite: {
    main: "red-500",
    bg: "from-red-100 to-red-50",
    badge: "bg-red-100 text-red-700 border-red-300",
    border: "border-red-300"
  },
  chantier: {
    main: "yellow-500",
    bg: "from-yellow-100 to-yellow-50",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-300",
    border: "border-yellow-300"
  },
  technique: {
    main: "purple-500",
    bg: "from-purple-100 to-purple-50",
    badge: "bg-purple-100 text-purple-700 border-purple-300",
    border: "border-purple-300"
  },
  mobilier: {
    main: "green-500",
    bg: "from-green-100 to-green-50",
    badge: "bg-green-100 text-green-700 border-green-300",
    border: "border-green-300"
  },
  logistique: {
    main: "pink-500",
    bg: "from-pink-100 to-pink-50",
    badge: "bg-pink-100 text-pink-700 border-pink-300",
    border: "border-pink-300"
  },
  electromenager: {
    main: "orange-500",
    bg: "from-orange-100 to-orange-50",
    badge: "bg-orange-100 text-orange-700 border-orange-300",
    border: "border-orange-300"
  },
  climatisation: {
    main: "cyan-500",
    bg: "from-cyan-100 to-cyan-50",
    badge: "bg-cyan-100 text-cyan-700 border-cyan-300",
    border: "border-cyan-300"
  },
  autre: {
    main: "gray-400",
    bg: "from-gray-100 to-gray-50",
    badge: "bg-gray-100 text-gray-700 border-gray-300",
    border: "border-gray-300"
  },
};

const getFileType = (filename) => {
  if (!filename) return null;
  const ext = filename.split('.').pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) return "image";
  if (["pdf"].includes(ext)) return "pdf";
  return "autre";
};

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
    case 'en_attente': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'refuse': return 'bg-red-100 text-red-800 border-red-300';
    case 'valide_technique': return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'valide': return 'bg-green-100 text-green-800 border-green-300';
    case 'materiel_indispo': return 'bg-gray-100 text-gray-800 border-gray-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const DetailDemandeCollaborateur = () => {
  const { id } = useParams();
  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/api/demandes/${id}`);
        setDemande(response.data.demande);
      } catch (err) {
        setError("Erreur lors du chargement de la demande.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <Layout><div className="py-16 text-center text-gray-500">Chargement...</div></Layout>;
  if (error) return <Layout><div className="py-16 text-center text-red-500">{error}</div></Layout>;
  if (!demande) return <Layout><div className="py-16 text-center text-gray-500">Aucune donnée</div></Layout>;

  // Remplacer la logique dynamique de couleur par une couleur unique (vert)
  const theme = {
    main: "green-600",
    bg: "from-green-100 to-green-50",
    badge: "bg-green-100 text-green-700 border-green-300",
    border: "border-green-300"
  };
  const bg = theme.bg;
  const icon = categoryIcons.autre;

  // Détermination du type de fichier de justification
  const getJustificationType = (filename) => {
    if (!filename) return null;
    const ext = filename.split('.').pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) return "image";
    if (["pdf"].includes(ext)) return "pdf";
    return "autre";
  };
  const justificationType = getJustificationType(demande.justification);
  const justificationUrl = demande.justification ? `${import.meta.env.VITE_BACKEND_URL}/storage/${demande.justification}` : null;

  return (
    <Layout>
      <div className={`w-full max-w-7xl mx-auto mt-10 rounded-3xl shadow-xl border ${theme.border} bg-gradient-to-br ${bg} p-0 md:p-0`}> 
        {/* Titre avec icône */}
        <div className="flex flex-col items-center justify-center pt-8 pb-2">
          {icon}
          <h2 className={`text-4xl md:text-5xl font-extrabold tracking-wide text-center mb-2 mt-2 text-${theme.main}`}>Détail de la demande</h2>
          <span className={`inline-block px-4 py-1 rounded-full text-base font-semibold mt-2 mb-4 shadow bg-white/80 border ${theme.badge}`}>Catégorie : {demande.categorie}</span>
        </div>
        {/* Carte des détails */}
        <div className="bg-white/90 rounded-2xl shadow p-6 md:p-10 mx-0 md:mx-12 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <div className="mb-4">
                <span className={`block font-semibold text-${theme.main}`}>Désignation</span>
                <span className="text-lg font-bold text-gray-800">{demande.designation}</span>
              </div>
              <div className="mb-4">
                <span className={`block font-semibold text-${theme.main}`}>Date de demande</span>
                <span className="text-base text-gray-700">{(demande.date_creation || demande.created_at)?.slice(0, 10)}</span>
              </div>
              <div className="mb-4">
                <span className={`block font-semibold text-${theme.main}`}>Quantité</span>
                <span className="text-base text-gray-800">{demande.quantite}</span>
              </div>
              <div className="mb-4">
                <span className={`block font-semibold text-${theme.main}`}>Type</span>
                <span className="text-base text-gray-800 capitalize">{demande.type}</span>
              </div>
            </div>
            <div>
              {/* Remplacer l'affichage de l'état et du motif de refus par un badge moderne et un encart élégant */}
              <div className="mb-6 flex flex-col items-center">
                {demande.etat === 'valide' && (
                  <span className="flex items-center gap-2 px-5 py-2 rounded-full bg-green-100 text-green-700 text-lg font-bold shadow border border-green-200">
                    <CheckCircle className="w-5 h-5" /> Validée
                  </span>
                )}
                {demande.etat === 'en_attente' && (
                  <span className="flex items-center gap-2 px-5 py-2 rounded-full bg-yellow-100 text-yellow-800 text-lg font-bold shadow border border-yellow-200">
                    <Clock className="w-5 h-5" /> En attente
                  </span>
                )}
                {demande.etat === 'valide_technique' && (
                  <span className="flex items-center gap-2 px-5 py-2 rounded-full bg-blue-100 text-blue-800 text-lg font-bold shadow border border-blue-200">
                    <Info className="w-5 h-5" /> Validée technique
                  </span>
                )}
                {demande.etat === 'materiel_indispo' && (
                  <span className="flex items-center gap-2 px-5 py-2 rounded-full bg-gray-100 text-gray-800 text-lg font-bold shadow border border-gray-200">
                    <Info className="w-5 h-5" /> Matériel indisponible
                  </span>
                )}
                {demande.etat === 'refuse' && (
                  <span className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-100 text-red-700 text-lg font-bold shadow border border-red-200">
                    <XCircle className="w-5 h-5" /> Refusée
                  </span>
                )}
              </div>
              {demande.etat === 'refuse' && demande.motif_refus && (
                <div className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4 mb-6 shadow">
                  <XCircle className="w-6 h-6 text-red-500" />
                  <div>
                    <div className="font-semibold text-red-700">Motif du refus :</div>
                    <div className="text-red-800">{demande.motif_refus}</div>
                  </div>
                </div>
              )}
              <div className="mb-4">
                <span className={`block font-semibold text-${theme.main}`}>Description</span>
                <span className="text-base text-gray-800">{demande.description}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Justification en bas */}
        <div className="mb-6 mx-0 md:mx-12">
          <span className={`block font-semibold mb-2 text-${theme.main}`}>Justification</span>
          <div className={`bg-white border rounded-lg p-3 min-h-[80px] flex items-center justify-center ${theme.border}`}>
            {justificationUrl ? (
              justificationType === "image" ? (
                <img src={justificationUrl} alt="Justification" className="max-w-full max-h-[600px] w-auto h-auto rounded shadow border mx-auto" />
              ) : justificationType === "pdf" ? (
                <iframe src={justificationUrl} title="Justification PDF" className="w-full h-[600px] border rounded" />
              ) : (
                <a href={justificationUrl} target="_blank" rel="noopener noreferrer" className={`hover:underline text-${theme.main}`}>Télécharger le fichier</a>
              )
            ) : (
              <span className="text-gray-400">Aucun fichier</span>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DetailDemandeCollaborateur; 