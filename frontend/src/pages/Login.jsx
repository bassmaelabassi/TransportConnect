import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    motDePasse: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await login(formData)

    if (result.success) {
      if (result.user.role === "admin") {
        navigate("/admin/dashboard")
      } else if (result.user.role === "conducteur") {
        navigate("/conducteur/annonces")
      } else if (result.user.role === "expediteur") {
        navigate("/expediteur/trajets")
      } else {
        navigate("/")
      }
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0ead2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-lg border border-[#dde5b6] p-8">
        <div className="flex flex-col items-center">
          <h2 className="mt-2 text-center text-3xl font-extrabold text-[#6c584c]">Connexion à votre compte</h2>
          <p className="mt-2 text-center text-sm text-[#a98467]">
            Ou{' '}
            <Link to="/register" className="font-medium text-[#adc178] hover:text-[#6c584c] underline">
              créez un nouveau compte
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-[#dde5b6] border border-[#adc178] text-[#6c584c] px-4 py-3 rounded">{error}</div>}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#6c584c]">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-[#adc178]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  className="mt-1 appearance-none relative block w-full px-10 py-2 border border-[#dde5b6] placeholder-[#a98467] text-[#6c584c] rounded-md focus:outline-none focus:ring-2 focus:ring-[#adc178] focus:border-[#adc178] bg-[#f0ead2]"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="motDePasse" className="block text-sm font-medium text-[#6c584c]">Mot de passe</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-[#adc178]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.104.896-2 2-2s2 .896 2 2m-4 0a2 2 0 104 0m-4 0V7a4 4 0 118 0v4m-8 0v4a4 4 0 008 0v-4" /></svg>
                </span>
                <input
                  id="motDePasse"
                  name="motDePasse"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="mt-1 appearance-none relative block w-full px-10 py-2 border border-[#dde5b6] placeholder-[#a98467] text-[#6c584c] rounded-md focus:outline-none focus:ring-2 focus:ring-[#adc178] focus:border-[#adc178] bg-[#f0ead2]"
                  placeholder="Mot de passe"
                  value={formData.motDePasse}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-base font-semibold rounded-md text-white bg-gradient-to-r from-[#a98467] to-[#6c584c] hover:from-[#6c584c] hover:to-[#a98467] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#adc178] disabled:opacity-50 shadow transition-all"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </div>
          <div className="border-t pt-4">
            <p className="text-xs text-[#a98467] text-center mb-2">Comptes de démonstration :</p>
            <div className="text-xs text-[#6c584c] space-y-1 text-center">
              <p>Admin: admin@transport.com</p>
              <p>Conducteur: conducteur@test.com</p>
              <p>Expéditeur: expediteur@test.com</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
