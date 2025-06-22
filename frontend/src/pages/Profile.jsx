import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    email: user?.email || "",
    telephone: user?.telephone || "",
    typeUtilisateur: user?.role || "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || "",
        prenom: user.prenom || "",
        email: user.email || "",
        telephone: user.telephone || "",
        typeUtilisateur: user.role || "",
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const result = await updateProfile(formData)

    if (result.success) {
      setMessage("Profil mis à jour avec succès")
      setIsEditing(false)
    } else {
      setMessage("Erreur lors de la mise à jour: " + result.error)
    }

    setLoading(false)
  }

  const handleCancel = () => {
    setFormData({
      nom: user?.nom || "",
      prenom: user?.prenom || "",
      email: user?.email || "",
      telephone: user?.telephone || "",
      typeUtilisateur: user?.role || "",
    })
    setIsEditing(false)
    setMessage("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-100 p-6">
      <div className="max-w-2xl w-full mx-auto">
        <div className="bg-white/90 rounded-xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-4 py-2 rounded-md hover:from-blue-700 hover:to-green-600 transition-all"
              >
                Modifier
              </button>
            )}
          </div>

          {message && (
            <div
              className={`mb-4 p-3 rounded ${
                message.includes("succès")
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {user?.prenom?.charAt(0)}
                  {user?.nom?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-medium">
                    {user?.prenom} {user?.nom}
                  </h3>
                  <p className="text-gray-600">{user?.email}</p>
                  {user?.verifie && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Compte vérifié
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isEditing
                        ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isEditing
                        ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isEditing
                      ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isEditing
                      ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type d'utilisateur</label>
                <input
                  type="text"
                  name="typeUtilisateur"
                  value={formData.typeUtilisateur === 'conducteur' ? 'Conducteur' : formData.typeUtilisateur === 'expediteur' ? 'Expéditeur' : formData.typeUtilisateur}
                  disabled
                  className="w-full px-3 py-2 border rounded-md border-gray-200 bg-gray-50 text-gray-500"
                />
              </div>
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Trajets effectués</p>
                    <p className="text-2xl font-bold text-blue-900">{user?.stats?.trajetsEffectues || 0}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Colis transportés</p>
                    <p className="text-2xl font-bold text-green-900">{user?.stats?.colisTransportes || 0}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-600 font-medium">Note moyenne</p>
                    <p className="text-2xl font-bold text-yellow-900">{user?.stats?.noteMoyenne || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-md hover:from-blue-700 hover:to-green-600 disabled:opacity-50 shadow-lg"
                >
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
