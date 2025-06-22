import { useState, useEffect } from "react"
import { trajetService } from "../services/trajetService"
import { demandeService } from "../services/demandeService"
import TrajetCard from "../components/TrajetCard"

const TrajetsDisponibles = () => {
  const [trajets, setTrajets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTrajet, setSelectedTrajet] = useState(null)
  const [showDemandeForm, setShowDemandeForm] = useState(false)
  const [filters, setFilters] = useState({
    depart: "",
    destination: "",
    date: "",
    typeColis: "",
  })
  const [demandeData, setDemandeData] = useState({
    poids: "",
    dimensions: "",
    type: "",
    description: "",
    message: "",
  })

  useEffect(() => {
    loadTrajets()
  }, [])

  const loadTrajets = async () => {
    try {
      const data = await trajetService.getTrajetsDisponibles(filters)
      setTrajets(data)
    } catch (error) {
      console.error("Erreur lors du chargement des trajets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setLoading(true)
    loadTrajets()
  }

  const handleDemandeClick = (trajet) => {
    setSelectedTrajet(trajet)
    setShowDemandeForm(true)
  }

  const handleSubmitDemande = async (e) => {
    e.preventDefault()
    try {
      await demandeService.createDemande({
        trajetId: selectedTrajet._id,
        ...demandeData,
      })
      setShowDemandeForm(false)
      setSelectedTrajet(null)
      setDemandeData({
        poids: "",
        dimensions: "",
        type: "",
        description: "",
        message: "",
      })
      alert("Demande envoyée avec succès!")
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande:", error)
      alert("Erreur lors de l'envoi de la demande")
    }
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    })
  }

  const handleDemandeChange = (e) => {
    setDemandeData({
      ...demandeData,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0ead2] section-padding">
      <div className="container-max">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#6c584c]">Trajets Disponibles</h1>
          <p className="text-[#a98467]">Trouvez des conducteurs pour transporter vos colis</p>
        </div>
        <div className="card mb-8">
          <h2 className="section-subheader">Rechercher un trajet</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="form-label">Départ</label>
              <input
                type="text"
                name="depart"
                value={filters.depart}
                onChange={handleFilterChange}
                className="form-input"
                placeholder="Ville de départ"
              />
            </div>
            <div>
              <label className="form-label">Destination</label>
              <input
                type="text"
                name="destination"
                value={filters.destination}
                onChange={handleFilterChange}
                className="form-input"
                placeholder="Ville de destination"
              />
            </div>
            <div>
              <label className="form-label">Date</label>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Type de colis</label>
              <select
                name="typeColis"
                value={filters.typeColis}
                onChange={handleFilterChange}
                className="form-input"
              >
                <option value="">Tous types</option>
                <option value="documents">Documents</option>
                <option value="vetements">Vêtements</option>
                <option value="electronique">Électronique</option>
                <option value="alimentaire">Alimentaire</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="mt-4 btn-primary flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Rechercher
          </button>
        </div>
        <div className="grid-responsive mt-8">
          {trajets.length === 0 ? (
            <div className="card text-center col-span-full">
              <p className="text-gray-500">Aucun trajet disponible pour le moment</p>
            </div>
          ) : (
            trajets.map((trajet) => (
              <TrajetCard key={trajet._id} trajet={trajet} onDemandeClick={handleDemandeClick} type="disponible" />
            ))
          )}
        </div>
        {showDemandeForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="card max-w-md w-full">
              <div className="card-header flex justify-between items-center">
                <h3 className="section-subheader">Envoyer une demande de transport</h3>
                <button onClick={() => setShowDemandeForm(false)} className="btn-outline text-sm px-3 py-1">Annuler</button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Trajet : {selectedTrajet?.depart} → {selectedTrajet?.destination}
              </p>

              <form onSubmit={handleSubmitDemande} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Poids (kg)</label>
                    <input
                      type="number"
                      name="poids"
                      value={demandeData.poids}
                      onChange={handleDemandeChange}
                      className="form-input"
                      placeholder="Ex: 10"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Dimensions</label>
                    <input
                      type="text"
                      name="dimensions"
                      value={demandeData.dimensions}
                      onChange={handleDemandeChange}
                      className="form-input"
                      placeholder="Ex: 40x30x20 cm"
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Type de colis</label>
                  <input
                    type="text"
                    name="type"
                    value={demandeData.type}
                    onChange={handleDemandeChange}
                    className="form-input"
                    placeholder="Ex: documents, vêtements, électronique..."
                  />
                </div>
                <div>
                  <label className="form-label">Description (optionnel)</label>
                  <textarea
                    name="description"
                    value={demandeData.description}
                    onChange={handleDemandeChange}
                    className="form-input"
                    placeholder="Ajoutez des détails sur le colis, la livraison, etc."
                    rows={2}
                  />
                </div>
                <div>
                  <label className="form-label">Message au conducteur (optionnel)</label>
                  <textarea
                    name="message"
                    value={demandeData.message}
                    onChange={handleDemandeChange}
                    className="form-input"
                    placeholder="Votre message..."
                    rows={2}
                  />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="btn-primary">
                    Envoyer la demande
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

export default TrajetsDisponibles
