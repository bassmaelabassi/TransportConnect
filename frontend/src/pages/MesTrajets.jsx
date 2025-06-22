import { useState, useEffect } from "react"
import { trajetService } from "../services/trajetService"
import { demandeService } from "../services/demandeService"
import { evaluationService } from "../services/evaluationServices"

const MesTrajets = () => {
  const [trajets, setTrajets] = useState([])
  const [demandes, setDemandes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("trajets")
  const [evalModal, setEvalModal] = useState({ open: false, demande: null })
  const [evalForm, setEvalForm] = useState({ note: 0, commentaire: '' })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [trajetsData, demandesData] = await Promise.all([
        trajetService.getMesTrajets(),
        demandeService.getDemandesRecues(),
      ])
      setTrajets(trajetsData)
      setDemandes(demandesData)
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptDemande = async (demandeId) => {
    try {
      await demandeService.accepterDemande(demandeId)
      loadData()
    } catch (error) {
      console.error("Erreur lors de l'acceptation:", error)
    }
  }

  const handleRefuseDemande = async (demandeId, raison) => {
    try {
      await demandeService.refuserDemande(demandeId, raison)
      loadData()
    } catch (error) {
      console.error("Erreur lors du refus:", error)
    }
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: "bg-green-100 text-green-800",
      terminee: "bg-gray-100 text-gray-800",
      "en-cours": "bg-blue-100 text-blue-800",
      annulee: "bg-red-100 text-red-800",
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || statusClasses.active}`}>
        {status === "active"
          ? "Actif"
          : status === "terminee"
            ? "Terminé"
            : status === "en-cours"
              ? "En cours"
              : status === "annulee"
                ? "Annulé"
                : status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0ead2] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#6c584c]">Mes Trajets</h1>
          <p className="text-[#a98467]">Gérez vos trajets et les demandes reçues</p>
        </div>
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab("trajets")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === "trajets"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Mes Trajets ({trajets.filter((t) => t.statut !== "terminee").length})
              </button>
              <button
                onClick={() => setActiveTab("demandes")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === "demandes"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Demandes Reçues ({demandes.filter((d) => d.statut === "en-attente").length})
              </button>
              <button
                onClick={() => setActiveTab("historique")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === "historique"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Historique ({trajets.filter((t) => t.statut === "terminee").length})
              </button>
            </nav>
          </div>
        </div>
        {activeTab === "trajets" && (
          <div className="space-y-6">
            {trajets.filter((t) => t.statut !== "terminee").length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">Aucun trajet actif pour le moment</p>
              </div>
            ) : (
              trajets
                .filter((t) => t.statut !== "terminee")
                .map((trajet) => (
                  <div key={trajet._id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">
                            {trajet.depart} → {trajet.destination}
                          </h3>
                          {getStatusBadge(trajet.statut)}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Date:</span> {new Date(trajet.date).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Heure:</span> {trajet.heure}
                          </div>
                          <div>
                            <span className="font-medium">Capacité:</span> {trajet.capacite} kg
                          </div>
                          <div>
                            <span className="font-medium">Prix:</span>{" "}
                            <span className="text-green-600 font-semibold">{trajet.prix} DH</span>
                          </div>
                        </div>

                        {trajet.etapes && (
                          <div className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Étapes:</span> {trajet.etapes}
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-2">
                          {trajet.demandes?.length || 0} demande
                          {(trajet.demandes?.length || 0) !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {activeTab === "demandes" && (
          <div className="space-y-6">
            {demandes.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">Aucune demande reçue pour le moment</p>
              </div>
            ) : (
              demandes.map((demande) => (
                <div key={demande._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold">
                          {demande.expediteur?.nom || ''} {demande.expediteur?.prenom || ''}
                          <span className="ml-2 text-xs text-gray-500">{demande.expediteur?.email}</span>
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            demande.statut === "en-attente"
                              ? "bg-yellow-100 text-yellow-800"
                              : demande.statut === "acceptee"
                              ? "bg-green-100 text-green-800"
                              : demande.statut === "terminee"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {demande.statut === "en-attente"
                            ? "En attente"
                            : demande.statut === "acceptee"
                            ? "Acceptée"
                            : demande.statut === "terminee"
                            ? "Terminée"
                            : "Refusée"}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 space-y-1 mb-3">
                        <p>
                          <span className="font-medium">Trajet:</span> {demande.trajet}
                        </p>
                        <p>
                          <span className="font-medium">Colis:</span> {demande.type} - {demande.poids}kg
                        </p>
                        {demande.dimensions && (
                          <p>
                            <span className="font-medium">Dimensions:</span> {demande.dimensions}
                          </p>
                        )}
                        {demande.description && (
                          <p>
                            <span className="font-medium">Description:</span> {demande.description}
                          </p>
                        )}
                        {demande.message && (
                          <p>
                            <span className="font-medium">Message:</span> {demande.message}
                          </p>
                        )}
                      </div>

                      <p className="text-xs text-gray-500">Demande reçue le {demande.dateCreation}</p>
                      {demande.statut === "terminee" && (
                        <button
                          onClick={() => setEvalModal({ open: true, demande })}
                          className="mt-2 bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          Évaluer l'expéditeur
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      {demande.statut === "en-attente" && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAcceptDemande(demande._id)}
                            className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 flex items-center"
                          >
                            Accepter
                          </button>
                          <button
                            onClick={() => handleRefuseDemande(demande._id, "Capacité insuffisante")}
                            className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 flex items-center"
                          >
                            Refuser
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "historique" && (
          <div className="space-y-6">
            {trajets.filter((t) => t.statut === "terminee").length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">Aucun trajet terminé pour le moment</p>
              </div>
            ) : (
              trajets.filter((t) => t.statut === "terminee").map((trajet) => (
                <div key={trajet.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold">
                          {trajet.depart} → {trajet.destination}
                        </h3>
                        {getStatusBadge(trajet.statut)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Date:</span> {trajet.date}
                        </div>
                        <div>
                          <span className="font-medium">Heure:</span> {trajet.heure}
                        </div>
                        <div>
                          <span className="font-medium">Capacité:</span> {trajet.capacite}
                        </div>
                        <div>
                          <span className="font-medium">Prix:</span>{" "}
                          <span className="text-green-600 font-semibold">{trajet.prix}</span>
                        </div>
                      </div>

                      {trajet.etapes && (
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Étapes:</span> {trajet.etapes}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-2">
                        {trajet.demandes || 0} demande{(trajet.demandes || 0) > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {evalModal.open && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-[#6c584c]">Évaluer l'expéditeur</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await evaluationService.evaluerExpediteur({
                    demandeId: evalModal.demande.id,
                    note: evalForm.note,
                    commentaire: evalForm.commentaire,
                  });
                  setEvalModal({ open: false, demande: null });
                  setEvalForm({ note: 0, commentaire: '' });
                  loadData();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-[#6c584c] mb-1">Note</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={evalForm.note}
                    onChange={e => setEvalForm({ ...evalForm, note: e.target.value })}
                    className="w-full px-3 py-2 border border-[#dde5b6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#adc178]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6c584c] mb-1">Commentaire</label>
                  <textarea
                    value={evalForm.commentaire}
                    onChange={e => setEvalForm({ ...evalForm, commentaire: e.target.value })}
                    className="w-full px-3 py-2 border border-[#dde5b6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#adc178]"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEvalModal({ open: false, demande: null })}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Envoyer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MesTrajets
