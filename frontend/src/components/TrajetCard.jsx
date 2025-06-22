import Rating from "./Rating"
import { useAuth } from "../hooks/useAuth"

const TrajetCard = ({ trajet, onDemandeClick, onDelete, onEdit, showActions = true, type = "disponible" }) => {
  const { user } = useAuth()
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {trajet.depart} → {trajet.destination}
            </h3>
            {trajet.statut && getStatusBadge(trajet.statut)}
          </div>

          {trajet.conducteur && (
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-gray-600">Conducteur:</span>
              <span className="font-medium">
                {typeof trajet.conducteur === 'object' 
                  ? `${trajet.conducteur.prenom} ${trajet.conducteur.nom}`
                  : trajet.conducteur
                }
              </span>
              {trajet.verifie && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Vérifié</span>
              )}
              {trajet.note && (
                <div className="flex items-center space-x-1">
                  <Rating rating={trajet.note} readonly size="sm" />
                  <span className="text-sm text-gray-600">({trajet.note})</span>
                </div>
              )}
            </div>
          )}

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
              <span className="font-medium">Prix:</span>
              <span className="text-green-600 font-semibold ml-1">{trajet.prix}</span>
            </div>
          </div>

          {trajet.etapes && (
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Étapes:</span> {trajet.etapes}
            </div>
          )}

          {trajet.typeMarchandise && (
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Types acceptés:</span> {trajet.typeMarchandise}
            </div>
          )}

          {trajet.description && <p className="text-sm text-gray-600 mt-2">{trajet.description}</p>}
        </div>
      </div>

      {showActions && (
        <div className="flex justify-between items-center pt-4 border-t">
          {type === "disponible" && onDemandeClick && user?.role !== 'conducteur' && (
            <button
              onClick={() => onDemandeClick(trajet)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Faire une demande
            </button>
          )}

          {type === "mes-trajets" && (
            <div className="flex space-x-2">
              <button 
                onClick={onEdit}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 text-sm"
              >
                Modifier
              </button>
              <button 
                onClick={onDelete}
                className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 text-sm"
              >
                Supprimer
              </button>
            </div>
          )}

          <div className="text-sm text-gray-500">
            {trajet.demandes && (
              <span>
                {trajet.demandes} demande{trajet.demandes > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TrajetCard