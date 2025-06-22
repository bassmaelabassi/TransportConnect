import { useState, useEffect } from "react"
import { demandeService } from "../services/demandeService"

const MesDemandes = () => {
  const [demandes, setDemandes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDemandes()
  }, [])

  const loadDemandes = async () => {
    try {
      const data = await demandeService.getMesDemandes()
      setDemandes(data)
    } catch (error) {
      console.error("Erreur lors du chargement des demandes:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      "en-attente": "bg-yellow-100 text-yellow-800",
      acceptee: "bg-green-100 text-green-800",
      refusee: "bg-red-100 text-red-800",
      terminee: "bg-gray-100 text-gray-800",
    }

    const statusLabels = {
      "en-attente": "En attente",
      acceptee: "Acceptée",
      refusee: "Refusée",
      terminee: "Terminée",
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {statusLabels[status]}
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#6c584c]">Mes Demandes</h1>
          <p className="text-[#a98467]">Suivez l'état de vos demandes de transport</p>
        </div>

        <div className="space-y-6">
          {demandes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">Aucune demande envoyée pour le moment</p>
            </div>
          ) : (
            demandes.map((demande) => (
              <div key={demande.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">
                        {demande.trajet.depart} → {demande.trajet.destination}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {demande.trajet.conducteur && (demande.trajet.conducteur.nom || demande.trajet.conducteur.prenom)
                            ? `${demande.trajet.conducteur.nom?.charAt(0) || ''}${demande.trajet.conducteur.prenom?.charAt(0) || ''}`.toUpperCase()
                            : '?'}
                        </div>
                        <span>
                          {demande.trajet.conducteur
                            ? `${demande.trajet.conducteur.nom || ''} ${demande.trajet.conducteur.prenom || ''}`.trim() || 'Conducteur inconnu'
                            : 'Conducteur inconnu'}
                        </span>
                        {demande.statut === 'acceptee' && (
                          <button className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200">Contacter</button>
                        )}
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Date du trajet:</span> {demande.trajet.date} à{" "}
                        {demande.trajet.heure}
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
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{demande.trajet.prix}</p>
                    <p className="text-xs text-gray-500">Demande envoyée le {demande.dateCreation}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-2">
                  <div className={`w-3 h-3 rounded-full ${demande.statut === 'en-attente' ? 'bg-yellow-400' : demande.statut === 'acceptee' ? 'bg-green-500' : demande.statut === 'refusee' ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                  <span className="text-xs text-gray-500">{getStatusBadge(demande.statut)}</span>
                  {demande.statut === 'acceptee' && <span className="text-xs text-green-600 ml-2 animate-pulse">Acceptée</span>}
                  {demande.statut === 'refusee' && <span className="text-xs text-red-600 ml-2">Refusée</span>}
                  {demande.statut === 'terminee' && <span className="text-xs text-blue-600 ml-2">Terminée</span>}
                </div>

                {demande.statut === "acceptee" && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-4">
                    <p className="text-green-800 text-sm">
                      <span className="font-medium">Bonne nouvelle!</span> Votre demande a été acceptée. Le conducteur
                      vous contactera bientôt.
                    </p>
                  </div>
                )}

                {demande.statut === "refusee" && demande.raisonRefus && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-4">
                    <p className="text-red-800 text-sm">
                      <span className="font-medium">Demande refusée:</span> {demande.raisonRefus}
                    </p>
                  </div>
                )}

                {demande.statut === "terminee" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
                    <p className="text-blue-800 text-sm">Transport terminé. N'oubliez pas d'évaluer le conducteur!</p>
                    <button className="mt-2 bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700">
                      Évaluer le conducteur
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default MesDemandes
