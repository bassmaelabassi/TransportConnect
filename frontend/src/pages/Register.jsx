import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const Register = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    motDePasse: "",
    confirmMotDePasse: "",
    typeUtilisateur: "",
    accepteConditions: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.motDePasse !== formData.confirmMotDePasse) {
      setError("Les mots de passe ne correspondent pas")
      setLoading(false)
      return
    }

    if (!formData.accepteConditions) {
      setError("Vous devez accepter les conditions d'utilisation")
      setLoading(false)
      return
    }

    const result = await register(formData)

    if (result.success) {
      navigate("/login", {
        state: { message: "Compte créé avec succès. Vous pouvez maintenant vous connecter." },
      })
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0ead2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white rounded-xl shadow-lg border border-[#dde5b6] p-8">
        <div className="flex flex-col items-center">
          <h2 className="mt-2 text-center text-3xl font-extrabold text-[#6c584c]">Créer un compte</h2>
          <p className="mt-2 text-center text-sm text-[#a98467]">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="font-medium text-[#adc178] hover:text-[#6c584c] underline">
              Connectez-vous
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="badge-error text-center">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="prenom" className="form-label text-[#6c584c]">Prénom</label>
              <input
                id="prenom"
                name="prenom"
                type="text"
                required
                className="form-input border-[#dde5b6] focus:border-[#adc178] focus:ring-2 focus:ring-[#adc178]"
                value={formData.prenom}
                onChange={handleChange}
                placeholder="Votre prénom"
              />
            </div>
            <div>
              <label htmlFor="nom" className="form-label text-[#6c584c]">Nom</label>
              <input
                id="nom"
                name="nom"
                type="text"
                required
                className="form-input border-[#dde5b6] focus:border-[#adc178] focus:ring-2 focus:ring-[#adc178]"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Votre nom"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="form-label text-[#6c584c]">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="form-input border-[#dde5b6] focus:border-[#adc178] focus:ring-2 focus:ring-[#adc178]"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label htmlFor="telephone" className="form-label text-[#6c584c]">Téléphone</label>
            <input
              id="telephone"
              name="telephone"
              type="tel"
              required
              className="form-input border-[#dde5b6] focus:border-[#adc178] focus:ring-2 focus:ring-[#adc178]"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="06 12 34 56 78"
            />
          </div>

          <div>
            <label htmlFor="typeUtilisateur" className="form-label text-[#6c584c]">Type d'utilisateur</label>
            <select
              id="typeUtilisateur"
              name="typeUtilisateur"
              required
              className="form-input border-[#dde5b6] focus:border-[#adc178] focus:ring-2 focus:ring-[#adc178]"
              value={formData.typeUtilisateur}
              onChange={handleChange}
            >
              <option value="">Sélectionnez votre rôle</option>
              <option value="conducteur">Conducteur</option>
              <option value="expediteur">Expéditeur</option>
            </select>
            <p className="text-xs text-[#a98467] mt-1">
              Le conducteur publie des trajets, l'expéditeur envoie des colis.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="motDePasse" className="form-label text-[#6c584c]">Mot de passe</label>
              <input
                id="motDePasse"
                name="motDePasse"
                type="password"
                required
                className="form-input border-[#dde5b6] focus:border-[#adc178] focus:ring-2 focus:ring-[#adc178]"
                value={formData.motDePasse}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label htmlFor="confirmMotDePasse" className="form-label text-[#6c584c]">Confirmer le mot de passe</label>
              <input
                id="confirmMotDePasse"
                name="confirmMotDePasse"
                type="password"
                required
                className="form-input border-[#dde5b6] focus:border-[#adc178] focus:ring-2 focus:ring-[#adc178]"
                value={formData.confirmMotDePasse}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="accepteConditions"
              name="accepteConditions"
              type="checkbox"
              className="h-4 w-4 text-[#adc178] focus:ring-[#adc178] border-[#dde5b6] rounded"
              checked={formData.accepteConditions}
              onChange={handleChange}
            />
            <label htmlFor="accepteConditions" className="ml-2 text-sm text-[#6c584c]">
              J'accepte les {" "}
              <a href="#" className="text-[#adc178] hover:text-[#6c584c]">conditions d'utilisation</a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-base font-semibold rounded-md text-white bg-gradient-to-r from-[#a98467] to-[#6c584c] hover:from-[#6c584c] hover:to-[#a98467] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#adc178] disabled:opacity-50 shadow transition-all"
            >
              {loading ? "Création..." : "Créer le compte"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
