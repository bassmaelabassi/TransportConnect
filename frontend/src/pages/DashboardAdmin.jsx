import { useState, useEffect } from "react"
import { Bar, Line, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"
import { adminService } from "../services/adminService"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement)

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    utilisateurs: 0,
    conducteurs: 0,
    expediteurs: 0,
    annonces: 0,
    demandes: 0,
    tauxAcceptation: 0,
  })
  const [recentAnnonces, setRecentAnnonces] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [monthlyAnnoncesData, setMonthlyAnnoncesData] = useState([])
  const [monthlyActiveUsersData, setMonthlyActiveUsersData] = useState([])
  const [requestDistributionData, setRequestDistributionData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [statsRes, annoncesRes, usersRes, monthlyAnnoncesRes, monthlyActiveUsersRes, requestDistRes] = await Promise.all([
          adminService.getStats(),
          adminService.getRecentAnnonces(),
          adminService.getRecentUsers(),
          Promise.resolve([12, 19, 15, 25, 22, 18]),
          Promise.resolve([65, 78, 90, 81, 95, 105]),
          Promise.resolve([78, 15, 7]),
        ])

        setStats({
          utilisateurs: statsRes.nbUtilisateurs,
          conducteurs: statsRes.nbUtilisateurs ? statsRes.nbUtilisateurs - statsRes.nbActifs : 0,
          expediteurs: statsRes.nbUtilisateurs ? statsRes.nbActifs : 0,
          annonces: statsRes.nbAnnonces,
          demandes: statsRes.nbDemandes,
          tauxAcceptation: statsRes.tauxAccept,
        })
        setRecentAnnonces(annoncesRes)
        setRecentUsers(usersRes)
        setMonthlyAnnoncesData(monthlyAnnoncesRes)
        setMonthlyActiveUsersData(monthlyActiveUsersRes)
        setRequestDistributionData(requestDistRes)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const barData = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"],
    datasets: [
      {
        label: "Nouvelles annonces",
        data: monthlyAnnoncesData, 
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  }

  const lineData = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"],
    datasets: [
      {
        label: "Utilisateurs actifs",
        data: monthlyActiveUsersData,
        fill: false,
        borderColor: "rgba(34, 197, 94, 1)",
        tension: 0.1,
      },
    ],
  }

  const doughnutData = {
    labels: ["Acceptées", "En attente", "Refusées"],
    datasets: [
      {
        data: requestDistributionData, 
        backgroundColor: ["rgba(34, 197, 94, 0.8)", "rgba(251, 191, 36, 0.8)", "rgba(239, 68, 68, 0.8)"],
      },
    ],
  }

  const handleUserAction = async (userId, action) => {
    try {
      setLoading(true)
      if (action === "validate") {
        await adminService.updateUserStatus(userId, { status: "active", badgeVerifie: true });
      } else if (action === "suspend") {
        await adminService.updateUserStatus(userId, { status: "suspended" });
      } else if (action === "verify") {
        await adminService.updateUserStatus(userId, { badgeVerifie: true });
      }
      const users = await adminService.getRecentUsers();
      setRecentUsers(users);
      setError(null);
    } catch (err) {
      setError(`Erreur lors de l'action sur l'utilisateur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  const handleAnnonceAction = async (annonceId, action, data) => {
    try {
      setLoading(true)
      if (action === "edit") {
        alert("La fonctionnalité d'édition nécessite une interface dédiée (page ou modal).");
      } else if (action === "delete") {
        if (window.confirm('Supprimer cette annonce ?')) {
          await adminService.deleteAnnonce(annonceId);
        }
      }
      const annonces = await adminService.getRecentAnnonces();
      setRecentAnnonces(annonces);
      setError(null);
    } catch (err) {
      setError(`Erreur lors de l'action sur l'annonce: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>
  }

  return (
    <div className="min-h-screen bg-[#f0ead2] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#6c584c]">Tableau de bord administrateur</h1>
          <p className="text-[#a98467]">Vue d'overview et gestion de la plateforme</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
                <p className="text-2xl font-bold text-[#6c584c]">{stats.utilisateurs}</p>
                <p className="text-xs text-green-600">+12% ce mois</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conducteurs</p>
                <p className="text-2xl font-bold text-[#6c584c]">{stats.conducteurs}</p>
                <p className="text-xs text-green-600">+8% ce mois</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expéditeurs</p>
                <p className="text-2xl font-bold text-[#6c584c]">{stats.expediteurs}</p>
                <p className="text-xs text-green-600">+5% ce mois</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M9 20v-2m3-2v2m-3-2a3 3 0 01-3-3V8a3 3 0 013-3h6a3 3 0 013 3v7a3 3 0 01-3 3h-6z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Annonces Actives</p>
                <p className="text-2xl font-bold text-[#6c584c]">{stats.annonces}</p>
                <p className="text-xs text-green-600">+15% ce mois</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Demandes</p> 
                <p className="text-2xl font-bold text-[#6c584c]">{stats.demandes}</p>
                <p className="text-xs text-blue-600">+10% ce mois</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux d'Acceptation</p>
                <p className="text-2xl font-bold text-[#6c584c]">{stats.tauxAcceptation}%</p>
                <p className="text-xs text-green-600">+3% ce mois</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="section-subheader mb-4">Évolution des Annonces</h3>
            <Bar data={barData} options={{ responsive: true }} />
          </div>
          <div className="card">
            <h3 className="section-subheader mb-4">Utilisateurs actifs</h3>
            <Line data={lineData} options={{ responsive: true }} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="section-subheader mb-4">Répartition des demandes</h3>
            <Doughnut data={doughnutData} options={{ responsive: true }} />
          </div>
          <div className="card">
            <h3 className="section-subheader mb-4">Dernières annonces publiées</h3>
            <div className="table-container">
              <table className="min-w-full">
                <thead className="table-header">
                  <tr>
                    <th className="px-4 py-2">Conducteur</th>
                    <th className="px-4 py-2">Départ</th>
                    <th className="px-4 py-2">Destination</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Statut</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAnnonces.map((annonce) => (
                    <tr key={annonce._id} className="table-row">
                      <td className="px-4 py-2">{annonce.conducteur?.nom} {annonce.conducteur?.prenom}</td>
                      <td className="px-4 py-2">{annonce.depart}</td>
                      <td className="px-4 py-2">{annonce.destination}</td>
                      <td className="px-4 py-2">{annonce.date ? new Date(annonce.date).toLocaleDateString() : ''}</td>
                      <td className="px-4 py-2">
                        {annonce.statut === "Active" ? (
                          <span className="badge-success">Active</span>
                        ) : (
                          <span className="badge-warning">Terminée</span>
                        )}
                      </td>
                      <td className="px-4 py-2 flex gap-1">
                        <button
                          onClick={() => handleAnnonceAction(annonce._id, "edit")}
                          className="btn-outline text-xs px-2 py-1"
                        >
                          Éditer
                        </button>
                        <button
                          onClick={() => handleAnnonceAction(annonce._id, "delete")}
                          className="btn-outline text-xs px-2 py-1 text-red-600 border-red-400 hover:bg-red-50"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card mb-8">
          <h3 className="section-subheader mb-4">Derniers utilisateurs inscrits</h3>
          <div className="table-container">
            <table className="min-w-full">
              <thead className="table-header">
                <tr>
                  <th className="px-4 py-2">Nom</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Statut</th>
                  <th className="px-4 py-2">Vérifié</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user._id} className="table-row">
                    <td className="px-4 py-2">{user.nom} {user.prenom}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2 capitalize">{user.role}</td>
                    <td className="px-4 py-2">
                      {user.status === "active" ? (
                        <span className="badge-success">Actif</span>
                      ) : (
                        <span className="badge-error">Suspendu</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {user.badgeVerifie ? (
                        <span className="badge-info">Oui</span>
                      ) : (
                        <span className="badge-warning">Non</span>
                      )}
                    </td>
                    <td className="px-4 py-2 flex gap-1">
                      <button
                        onClick={() => handleUserAction(user._id, "validate")}
                        className="btn-outline text-xs px-2 py-1 text-green-600 border-green-400 hover:bg-green-50"
                      >
                        Valider
                      </button>
                      <button
                        onClick={() => handleUserAction(user._id, "suspend")}
                        className="btn-outline text-xs px-2 py-1 text-red-600 border-red-400 hover:bg-red-50"
                      >
                        Suspendre
                      </button>
                      {!user.badgeVerifie && (
                        <button
                          onClick={() => handleUserAction(user._id, "verify")}
                          className="btn-outline text-xs px-2 py-1 text-blue-600 border-blue-400 hover:bg-blue-50"
                        >
                          Vérifier
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardAdmin
