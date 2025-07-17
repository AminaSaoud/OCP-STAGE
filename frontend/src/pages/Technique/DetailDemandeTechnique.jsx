import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosClient } from "../../api/axios";
import Layout from "../../components/Layout";

// Icônes par catégorie
const categoryIcons = {
  informatique: (
    <svg className="w-14 h-14 text-blue-500 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="#dbeafe" />
      <path d="M8 20h8M12 16v4" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  securite: (
    <svg className="w-14 h-14 text-red-500 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 3l8 4v5c0 5.25-3.5 10-8 10S4 17.25 4 12V7l8-4z" fill="#fee2e2" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  chantier: (
    <svg className="w-14 h-14 text-yellow-500 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="4" y="10" width="16" height="8" rx="2" fill="#fef9c3" stroke="currentColor" strokeWidth="2" />
      <path d="M2 18h20" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  technique: (
    <svg className="w-14 h-14 text-purple-500 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#ede9fe" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  mobilier: (
    <svg className="w-14 h-14 text-green-500 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="5" y="10" width="14" height="7" rx="2" fill="#bbf7d0" stroke="currentColor" strokeWidth="2" />
      <path d="M8 17v2M16 17v2" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  logistique: (
    <svg className="w-14 h-14 text-pink-500 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="7" width="18" height="10" rx="2" fill="#fce7f3" stroke="currentColor" strokeWidth="2" />
      <circle cx="7" cy="17" r="2" fill="#f9a8d4" />
      <circle cx="17" cy="17" r="2" fill="#f9a8d4" />
    </svg>
  ),
  electromenager: (
    <svg className="w-14 h-14 text-orange-500 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="6" y="4" width="12" height="16" rx="2" fill="#ffedd5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="18" r="1" fill="#fdba74" />
    </svg>
  ),
  climatisation: (
    <svg className="w-14 h-14 text-cyan-500 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="4" y="7" width="16" height="10" rx="2" fill="#cffafe" stroke="currentColor" strokeWidth="2" />
      <path d="M8 17v2M16 17v2" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  autre: (
    <svg className="w-14 h-14 text-gray-400 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#f3f4f6" stroke="currentColor" strokeWidth="2" />
      <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#9ca3af">?</text>
    </svg>
  ),
};

const getFileType = (filename) => {
  if (!filename) return null;
  const ext = filename.split('.').pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) return "image";
  if (["pdf"].includes(ext)) return "pdf";
  return "autre";
};

// Palette de couleurs par catégorie
const categoryTheme = {
  informatique: {
    main: "blue-500",
    bg: "from-blue-100 to-blue-50",
    badge: "bg-blue-100 text-blue-700 border-blue-300",
    btn: "bg-blue-600 hover:bg-blue-700",
    border: "border-blue-300"
  },
  securite: {
    main: "red-500",
    bg: "from-red-100 to-red-50",
    badge: "bg-red-100 text-red-700 border-red-300",
    btn: "bg-red-600 hover:bg-red-700",
    border: "border-red-300"
  },
  chantier: {
    main: "yellow-500",
    bg: "from-yellow-100 to-yellow-50",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-300",
    btn: "bg-yellow-500 hover:bg-yellow-600 text-white",
    border: "border-yellow-300"
  },
  technique: {
    main: "purple-500",
    bg: "from-purple-100 to-purple-50",
    badge: "bg-purple-100 text-purple-700 border-purple-300",
    btn: "bg-purple-600 hover:bg-purple-700",
    border: "border-purple-300"
  },
  mobilier: {
    main: "green-500",
    bg: "from-green-100 to-green-50",
    badge: "bg-green-100 text-green-700 border-green-300",
    btn: "bg-green-600 hover:bg-green-700",
    border: "border-green-300"
  },
  logistique: {
    main: "pink-500",
    bg: "from-pink-100 to-pink-50",
    badge: "bg-pink-100 text-pink-700 border-pink-300",
    btn: "bg-pink-600 hover:bg-pink-700",
    border: "border-pink-300"
  },
  electromenager: {
    main: "orange-500",
    bg: "from-orange-100 to-orange-50",
    badge: "bg-orange-100 text-orange-700 border-orange-300",
    btn: "bg-orange-600 hover:bg-orange-700",
    border: "border-orange-300"
  },
  climatisation: {
    main: "cyan-500",
    bg: "from-cyan-100 to-cyan-50",
    badge: "bg-cyan-100 text-cyan-700 border-cyan-300",
    btn: "bg-cyan-600 hover:bg-cyan-700",
    border: "border-cyan-300"
  },
  autre: {
    main: "gray-400",
    bg: "from-gray-100 to-gray-50",
    badge: "bg-gray-100 text-gray-700 border-gray-300",
    btn: "bg-gray-500 hover:bg-gray-600",
    border: "border-gray-300"
  },
};

const DetailDemandeTechnique = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [showMotif, setShowMotif] = useState(false);
  const [motifRefus, setMotifRefus] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/api/tech/demandes/${id}`);
        setDemande(response.data.demande);
      } catch (err) {
        setError("Erreur lors du chargement de la demande.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const accepterDemande = async () => {
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      await axiosClient.post(`/api/tech/demandes/${id}/accepter`);
      setActionSuccess("Demande acceptée avec succès.");
      setTimeout(() => navigate(-1), 1200);
    } catch (err) {
      setActionError("Erreur lors de l'acceptation de la demande.");
    } finally {
      setActionLoading(false);
    }
  };

  const refuserDemande = async () => {
    if (!showMotif) {
      setShowMotif(true);
      return;
    }
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      await axiosClient.post(`/api/tech/demandes/${id}/rejeter`, { motif_refus: motifRefus });
      setActionSuccess("Demande refusée avec succès.");
      setTimeout(() => navigate(-1), 1200);
    } catch (err) {
      setActionError("Erreur lors du refus de la demande.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Layout><div className="py-16 text-center text-gray-500">Chargement...</div></Layout>;
  if (error) return <Layout><div className="text-red-600 py-16 text-center">{error}</div></Layout>;
  if (!demande) return <Layout><div className="py-16 text-center">Aucune demande trouvée.</div></Layout>;

  // Détermination du type de fichier de justification
  const justificationType = getFileType(demande.justification);
  const justificationUrl = demande.justification ? `${import.meta.env.VITE_BACKEND_URL}/storage/${demande.justification}` : null;
  const cat = (demande.categorie || "autre").toLowerCase().normalize("NFD").replace(/é/g, "e").replace(/[^a-z]/g, "");
  const theme = categoryTheme[cat] || categoryTheme.autre;
  const bg = theme.bg;
  const icon = categoryIcons[cat] || categoryIcons.autre;

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
                <span className={`block font-semibold text-${theme.main}`}>Demandeur</span>
                <span className="text-lg font-bold text-gray-800">{demande.collaborateur ? `${demande.collaborateur.prenom} ${demande.collaborateur.nom}` : "-"}</span>
              </div>
              <div className="mb-4">
                <span className={`block font-semibold text-${theme.main}`}>Désignation</span>
                <span className="text-lg font-bold text-gray-800">{demande.designation}</span>
              </div>
              <div className="mb-4">
                <span className={`block font-semibold text-${theme.main}`}>Date de demande</span>
                <span className="text-base text-gray-700">{(demande.date_creation || demande.created_at)?.slice(0, 10)}</span>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <span className={`block font-semibold text-${theme.main}`}>État</span>
                <span className={`inline-block px-3 py-1 rounded text-base font-semibold shadow border ${theme.badge}`}>{demande.etat}</span>
              </div>
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
              <span className="text-gray-400 text-xs">Aucune justification fournie.</span>
            )}
          </div>
        </div>
        {demande.etat === 'refuse' && demande.motif_refus && (
          <div
            className="mt-4 p-4 !bg-white !text-red-700 border border-red-300 rounded shadow-sm"
            style={{ backgroundColor: "#fff", color: "#b91c1c" }}
          >
            <span className="font-semibold">Motif du refus :</span>
            <div className="mt-1">{demande.motif_refus}</div>
          </div>
        )}
        {showMotif && (
          <div className="mb-4">
            <label className="block font-semibold text-red-700 mb-1">Motif du refus :</label>
            <textarea
              className="w-full border border-red-300 rounded p-2"
              rows={3}
              value={motifRefus}
              onChange={e => setMotifRefus(e.target.value)}
              placeholder="Saisir le motif du refus..."
              required
            />
          </div>
        )}
        {/* Boutons */}
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
          <button
            className={`px-8 py-3 ${theme.btn} text-white rounded-xl text-lg font-bold shadow transition disabled:opacity-60`}
            onClick={accepterDemande}
            disabled={actionLoading}
          >
            Accepter
          </button>
          <button
            className={`px-8 py-3 bg-red-600 text-white rounded-xl text-lg font-bold shadow hover:bg-red-700 transition disabled:opacity-60`}
            onClick={refuserDemande}
            disabled={actionLoading}
          >
            {showMotif ? "Confirmer le refus" : "Refuser"}
          </button>
          <button
            className={`px-8 py-3 bg-gray-100 text-gray-700 rounded-xl text-lg font-bold shadow hover:bg-gray-200 transition`}
            onClick={() => navigate(-1)}
          >
            Retour
          </button>
        </div>
        {actionError && <div className="text-red-600 mb-4 text-center text-lg animate-pulse">{actionError}</div>}
        {actionSuccess && <div className="text-green-700 mb-4 text-center text-lg animate-pulse">{actionSuccess}</div>}
      </div>
    </Layout>
  );
};

export default DetailDemandeTechnique; 