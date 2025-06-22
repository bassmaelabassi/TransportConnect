import { useState, useEffect } from "react"
import { trajetService } from "../services/trajetService"
import TrajetCard from "../components/TrajetCard"

const AnnoncesConducteur = () => {
  const [annonces, setAnnonces] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    _id: null,
    depart: "",
    destination: "",
    etapes: "",
    date: "",
    heure: "",
    capacite: "",
    dimensions: "",
    typeMarchandise: "",
    prix: "",
    description: "",
  })

  useEffect(() => {
    loadAnnonces()
  }, [])

  const loadAnnonces = async () => {
    try {
      const data = await trajetService.getMesTrajets()
      setAnnonces(data)
    } catch (error) {
      console.error("Erreur lors du chargement des annonces:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (formData._id) {
        await trajetService.updateTrajet(formData._id, formData);
      } else {
        await trajetService.createTrajet(formData);
      }
      setShowForm(false)
      setFormData({
        _id: null,
        depart: "",
        destination: "",
        etapes: "",
        date: "",
        heure: "",
        capacite: "",
        dimensions: "",
        typeMarchandise: "",
        prix: "",
        description: "",
      })
      loadAnnonces()
    } catch (error) {
      console.error("Erreur lors de la soumission de l'annonce:", error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleDelete = async (trajetId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      try {
        await trajetService.deleteTrajet(trajetId)
        loadAnnonces()
      } catch (error) {
        console.error("Erreur lors de la suppression de l'annonce:", error)
        alert("Une erreur est survenue lors de la suppression.")
      }
    }
  }

  const handleEdit = (trajet) => {
    setFormData({
      ...trajet,
    })
    setShowForm(true)
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
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#6c584c]">Mes Annonces</h1>
            <p className="text-[#a98467]">Gérez vos trajets et annonces de transport</p>
          </div>
          <button
            onClick={() => {
              setFormData({ _id: null, depart: "", destination: "", etapes: "", date: "", heure: "", capacite: "", dimensions: "", typeMarchandise: "", prix: "", description: "" });
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-[#a98467] to-[#6c584c] text-white px-4 py-2 rounded-md hover:from-[#6c584c] hover:to-[#a98467] transition-all shadow"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle Annonce
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg border border-[#dde5b6] mb-8">
            <div className="flex justify-between items-center p-4 border-b border-[#dde5b6]">
              <h2 className="text-xl font-bold text-[#6c584c]">{formData._id ? "Modifier l'annonce" : "Publier une nouvelle annonce"}</h2>
              <button onClick={() => setShowForm(false)} className="text-[#6c584c] hover:text-[#a98467] px-3 py-1 rounded-md border border-[#dde5b6]">Annuler</button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#6c584c] mb-1">Lieu de départ</label>
                  <input type="text" name="depart" value={formData.depart} onChange={handleChange} className="w-full px-3 py-2 border border-[#dde5b6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#adc178]" placeholder="Ville de départ" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6c584c] mb-1">Destination</label>
                  <input type="text" name="destination" value={formData.destination} onChange={handleChange} className="w-full px-3 py-2 border border-[#dde5b6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#adc178]" placeholder="Ville de destination" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#6c584c] mb-1">Date du trajet</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-3 py-2 border border-[#dde5b6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#adc178]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6c584c] mb-1">Heure de départ</label>
                  <input type="time" name="heure" value={formData.heure} onChange={handleChange} className="w-full px-3 py-2 border border-[#dde5b6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#adc178]" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6c584c] mb-1">Étapes intermédiaires (optionnel)</label>
                <input type="text" name="etapes" value={formData.etapes} onChange={handleChange} className="w-full px-3 py-2 border border-[#dde5b6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#adc178]" placeholder="Villes d'étapes séparées par des virgules" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#6c584c] mb-1">Capacité (kg)</label>
                  <input type="number" name="capacite" value={formData.capacite} onChange={handleChange} className="w-full px-3 py-2 border border-[#dde5b6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#adc178]" placeholder="Ex: 50" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6c584c] mb-1">Dimensions max</label>
                  <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} className="w-full px-3 py-2 border border-[#dde5b6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#adc178]" placeholder="Ex: 100x50x30 cm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6c584c] mb-1">Prix (DH)</label>
                  <input type="number" name="prix" value={formData.prix} onChange={handleChange} className="w-full px-3 py-2 border border-[#dde5b6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#adc178]" placeholder="Ex: 150" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6c584c] mb-1">Type de marchandise acceptée</label>
                <input type="text" name="typeMarchandise" value={formData.typeMarchandise} onChange={handleChange} className="w-full px-3 py-2 border border-[#dde5b6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#adc178]" placeholder="Ex: documents, vêtements, électronique..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6c584c] mb-1">Description (optionnel)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#dde5b6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#adc178]"
                  placeholder="Ajoutez des détails sur le trajet, les conditions, etc."
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <button type="submit" className="bg-gradient-to-r from-[#a98467] to-[#6c584c] text-white px-6 py-2 rounded-md hover:from-[#6c584c] hover:to-[#a98467] transition-all shadow">
                  {formData._id ? "Mettre à jour" : "Publier"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid-responsive mt-8">
          {annonces.length === 0 ? (
            <div className="card text-center col-span-full">
              <p className="text-gray-500">Aucune annonce pour le moment</p>
            </div>
          ) : (
            annonces.map((trajet) => (
              <TrajetCard 
                key={trajet._id} 
                trajet={trajet} 
                type="mes-trajets" 
                onDelete={() => handleDelete(trajet._id)}
                onEdit={() => handleEdit(trajet)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AnnoncesConducteur
