import { useState, useEffect } from "react"
import { demandeService } from "../services/demandeService"
import { notificationService } from "../services/notificationServices"

const DemandesRecues = () => {
  const [demandes, setDemandes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("en_attente")
  const [selectedDemande, setSelectedDemande] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadDemandes()
  }, [])

  const loadDemandes = async () => {
    try {
      const data = await demandeService.getDemandesRecues()
      setDemandes(data || [])
    } catch (error) {
      console.error("Erreur lors du chargement des demandes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptDemande = async (demandeId) => {
    setActionLoading(true)
    try {
      await demandeService.accepterDemande(demandeId)
      await loadDemandes()
      await notificationService.markAllAsRead()
    } catch (error) {
      console.error("Erreur lors de l'acceptation:", error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleRefuseDemande = async (demandeId, raison = "") => {
    setActionLoading(true)
    try {
      await demandeService.refuserDemande(demandeId, raison)
      await loadDemandes()
      await notificationService.markAllAsRead()
    } catch (error) {
      console.error("Erreur lors du refus:", error)
    } finally {
      setActionLoading(false)
      setShowModal(false)
      setSelectedDemande(null)
    }
  }

  const handleMarkAsDelivered = async (demandeId) => {
    setActionLoading(true);
    try {
      await demandeService.marquerCommeLivree(demandeId);
      await loadDemandes();
    } catch (error) {
      console.error("Erreur lors du marquage comme livré:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const openRefuseModal = (demande) => {
    setSelectedDemande(demande)
    setShowModal(true)
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      "en_attente": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "acceptee": "bg-green-100 text-green-800 border-green-200",
      "refusee": "bg-red-100 text-red-800 border-red-200",
      "livree": "bg-blue-100 text-blue-800 border-blue-200",
    }

    const statusLabels = {
      "en_attente": "En attente",
      "acceptee": "Acceptée",
      "refusee": "Refusée",
      "livree": "Livrée",
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusClasses[status]}`}>
        {statusLabels[status]}
      </span>
    )
  }

  const filteredDemandes = demandes.filter(demande => {
    if (filter === "all") return true
    return demande.statut === filter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6c584c]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0ead2] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#6c584c] flex items-center">
            Demandes Reçues
            {demandes.filter(d => d.statut === "en_attente").length > 0 && (
              <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#dde5b6] text-[#6c584c] animate-pulse border border-[#adc178]">
                {demandes.filter(d => d.statut === "en_attente").length} en attente
              </span>
            )}
          </h1>
          <p className="text-[#a98467]">Gérez les demandes de transport reçues pour vos trajets</p>
        </div>

        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setFilter("all")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  filter === "all"
                    ? "border-[#6c584c] text-[#6c584c]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Toutes ({demandes.length})
              </button>
              <button
                onClick={() => setFilter("en_attente")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  filter === "en_attente"
                    ? "border-[#6c584c] text-[#6c584c]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                En attente ({demandes.filter(d => d.statut === "en_attente").length})
              </button>
              <button
                onClick={() => setFilter("acceptee")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  filter === "acceptee"
                    ? "border-[#6c584c] text-[#6c584c]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Acceptées ({demandes.filter(d => d.statut === "acceptee").length})
              </button>
              <button
                onClick={() => setFilter("refusee")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  filter === "refusee"
                    ? "border-[#6c584c] text-[#6c584c]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Refusées ({demandes.filter(d => d.statut === "refusee").length})
              </button>
              <button
                onClick={() => setFilter("livree")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  filter === "livree"
                    ? "border-[#6c584c] text-[#6c584c]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Livées ({demandes.filter(d => d.statut === "livree").length})
              </button>
            </nav>
          </div>
        </div>

        <div className="space-y-6">
          {filteredDemandes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-2-2m0 0l-2 2m2-2v6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === "en_attente" 
                  ? "Aucune demande en attente" 
                  : filter === "acceptee"
                  ? "Aucune demande acceptée"
                  : filter === "refusee"
                  ? "Aucune demande refusée"
                  : filter === "livree"
                  ? "Aucune demande livrée"
                  : "Aucune demande reçue"}
              </h3>
              <p className="text-gray-500">
                {filter === "en_attente" 
                  ? "Vous n'avez aucune demande en attente de réponse"
                  : "Les demandes apparaîtront ici une fois traitées"}
              </p>
            </div>
          ) : (
            filteredDemandes.map((demande) => (
              <div key={demande._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-[#6c584c] rounded-full flex items-center justify-center text-white font-bold">
                          {demande.expediteur?.nom?.charAt(0) || demande.expediteur?.prenom?.charAt(0) || '?'}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[#6c584c]">
                            {demande.expediteur?.prenom || ''} {demande.expediteur?.nom || ''}
                          </h3>
                          <p className="text-sm text-gray-500">{demande.expediteur?.email}</p>
                        </div>
                      </div>
                      {getStatusBadge(demande.statut)}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-[#6c584c] mb-2">Trajet concerné</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">
                            <span className="font-medium">Départ:</span> {demande.trajet?.depart}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Destination:</span> {demande.trajet?.destination}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">
                            <span className="font-medium">Date:</span> {demande.trajet?.date} à {demande.trajet?.heure}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Prix:</span> {demande.trajet?.prix}€
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <h4 className="font-medium text-[#6c584c]">Détails du colis</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-gray-600">
                            <span className="font-medium">Type:</span> {demande.typeColis || 'Non spécifié'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">
                            <span className="font-medium">Poids:</span> {demande.poids || 'Non spécifié'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">
                            <span className="font-medium">Dimensions:</span> {demande.dimensions || 'Non spécifiées'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-400">
                      Demande reçue le {new Date(demande.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col space-y-2">
                    {demande.statut === "en_attente" && (
                      <>
                        <button
                          onClick={() => handleAcceptDemande(demande._id)}
                          disabled={actionLoading}
                          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {actionLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          <span>Accepter</span>
                        </button>
                        <button
                          onClick={() => openRefuseModal(demande)}
                          disabled={actionLoading}
                          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>Refuser</span>
                        </button>
                      </>
                    )}

                    {demande.statut === "acceptee" && (
                      <>
                        <button
                          onClick={() => handleMarkAsDelivered(demande._id)}
                          disabled={actionLoading}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {actionLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          )}
                          <span>Marquer comme livrée</span>
                        </button>
                      </>
                    )}

                    {demande.statut === "livree" && (
                      <div className="text-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <p className="text-xs text-blue-600 font-medium">Livrée</p>
                      </div>
                    )}

                    {demande.statut === "refusee" && (
                      <div className="text-center">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <p className="text-xs text-red-600 font-medium">Refusée</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && selectedDemande && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-[#6c584c] mb-4">Refuser la demande</h3>
            <p className="text-gray-600 mb-4">
              Êtes-vous sûr de vouloir refuser la demande de {selectedDemande.expediteur?.prenom} {selectedDemande.expediteur?.nom} ?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleRefuseDemande(selectedDemande._id)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Confirmer le refus
              </button>
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedDemande(null)
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DemandesRecues 