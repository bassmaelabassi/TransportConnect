import { useState, useEffect } from "react"
import { evaluationService } from "../services/evaluationServices"
import { useAuth } from "../hooks/useAuth"
import Rating from "../components/Rating"

const Evaluations = () => {
  const [demandesAevaluer, setDemandesAevaluer] = useState([])
  const [evaluationsRecues, setEvaluationsRecues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("a-donner")
  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [demandesRes, evalsRes] = await Promise.all([
          evaluationService.getDemandesAevaluer(),
          evaluationService.getEvaluationsRecues()
        ])
        setDemandesAevaluer(demandesRes || [])
        setEvaluationsRecues(evalsRes || [])
        setError(null)
      } catch (err) {
        console.error("Erreur lors de la récupération des données d'évaluation:", err)
        setError("Impossible de charger les données. Veuillez réessayer.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const EvaluationCard = ({ demande }) => {
    const [note, setNote] = useState(0)
    const [commentaire, setCommentaire] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState("")

    if (!demande || !demande.trajet || !demande.expediteur || !demande.trajet.conducteur) {
        return <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">Chargement des détails de l'évaluation...</div>;
    }

    const otherUser = demande.trajet.conducteur._id === user._id ? demande.expediteur : demande.trajet.conducteur;

    const handleSubmit = async (e) => {
      e.preventDefault()
      if (note === 0) {
        setSubmitError("Veuillez attribuer une note.")
        return
      }
      setIsSubmitting(true)
      setSubmitError("")
      try {
        await evaluationService.createEvaluation({
          demandeId: demande._id,
          note,
          commentaire
        })
        setDemandesAevaluer(prev => prev.filter(d => d._id !== demande._id))
      } catch (err) {
        setSubmitError(err.response?.data?.message || "Une erreur est survenue.")
      } finally {
        setIsSubmitting(false)
      }
    }

    return (
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#adc178]">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600">Évaluation pour le trajet :</p>
            <h3 className="text-lg font-semibold text-[#6c584c]">
              {demande.trajet.depart} → {demande.trajet.destination}
            </h3>
            <p className="text-sm text-gray-500">
              Avec <span className="font-medium">{otherUser.prenom} {otherUser.nom}</span>
            </p>
          </div>
          <span className="text-xs text-gray-400">
            Livré le {new Date(demande.updatedAt).toLocaleDateString()}
          </span>
        </div>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Votre note</label>
              <Rating note={note} onNoteChange={setNote} />
            </div>
            <div>
              <label htmlFor={`commentaire-${demande._id}`} className="block text-sm font-medium text-gray-700">
                Votre commentaire (optionnel)
              </label>
              <textarea
                id={`commentaire-${demande._id}`}
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder={`Laissez un commentaire sur votre expérience avec ${otherUser.prenom}...`}
              ></textarea>
            </div>
          </div>
          {submitError && <p className="text-sm text-red-600 mt-2">{submitError}</p>}
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#6c584c] hover:bg-[#a98467] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a98467] disabled:opacity-50"
            >
              {isSubmitting ? "Envoi..." : "Envoyer l'évaluation"}
            </button>
          </div>
        </form>
      </div>
    )
  }

  const ReceivedEvaluationCard = ({ evaluation }) => (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#6c584c] rounded-full flex items-center justify-center text-white font-bold">
            {evaluation.evaluateur.prenom?.charAt(0)}{evaluation.evaluateur.nom?.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{evaluation.evaluateur.prenom} {evaluation.evaluateur.nom}</p>
            <p className="text-xs text-gray-500">
              Pour le trajet {evaluation.demande?.trajet?.depart} → {evaluation.demande?.trajet?.destination}
            </p>
          </div>
        </div>
        <span className="text-xs text-gray-400">{new Date(evaluation.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="my-3">
        <Rating note={evaluation.note} readOnly />
      </div>
      {evaluation.commentaire && (
        <p className="text-gray-700 bg-gray-50 p-3 rounded-md italic">"{evaluation.commentaire}"</p>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f0ead2] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#6c584c]">Vos Évaluations</h1>
          <p className="text-[#a98467]">Laissez des évaluations pour vos trajets terminés et consultez celles que vous avez reçues.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6 px-6">
              <button
                onClick={() => setActiveTab("a-donner")}
                className={`py-4 px-1 text-sm font-medium border-b-2 ${activeTab === "a-donner" ? "border-[#6c584c] text-[#6c584c]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                À donner ({demandesAevaluer.length})
              </button>
              <button
                onClick={() => setActiveTab("recues")}
                className={`py-4 px-1 text-sm font-medium border-b-2 ${activeTab === "recues" ? "border-[#6c584c] text-[#6c584c]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                Reçues ({evaluationsRecues.length})
              </button>
            </nav>
          </div>
        </div>

        {loading && <p>Chargement...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div>
            {activeTab === "a-donner" && (
              <div className="space-y-6">
                {demandesAevaluer.length > 0 ? (
                  demandesAevaluer.map(demande => <EvaluationCard key={demande._id} demande={demande} />)
                ) : (
                  <p className="text-center text-gray-500 py-8">Vous n'avez aucune évaluation à donner pour le moment.</p>
                )}
              </div>
            )}
            {activeTab === "recues" && (
              <div className="space-y-4">
                {evaluationsRecues.length > 0 ? (
                  evaluationsRecues.map(evaluation => <ReceivedEvaluationCard key={evaluation._id} evaluation={evaluation} />)
                ) : (
                  <p className="text-center text-gray-500 py-8">Vous n'avez reçu aucune évaluation pour le moment.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Evaluations
