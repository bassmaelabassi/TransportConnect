import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./hooks/useAuth"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import PrivateRoute from "./components/PrivateRoute"
import PublicRoute from "./components/PublicRoute"
import AdminRoute from "./components/AdminRoute"

import Login from "./pages/Login"
import Register from "./pages/Register"
import DashboardAdmin from "./pages/DashboardAdmin"
import AnnoncesConducteur from "./pages/AnnoncesConducteur"
import TrajetsDisponibles from "./pages/TrajetsDisponibles"
import MesDemandes from "./pages/MesDemandes"
import MesTrajets from "./pages/MesTrajets"
import Profile from "./pages/Profile"
import Evaluations from "./pages/Evaluations"
import Notifications from "./pages/Notifications"
import DemandesRecues from "./pages/DemandesRecues"
import NotFound from "./pages/NotFound"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />

              <Route
                path="/"
                element={
                  <PrivateRoute requiredRole="expediteur">
                    <TrajetsDisponibles />
                  </PrivateRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />

              <Route
                path="/notifications"
                element={
                  <PrivateRoute>
                    <Notifications />
                  </PrivateRoute>
                }
              />

              <Route
                path="/evaluations"
                element={
                  <PrivateRoute>
                    <Evaluations />
                  </PrivateRoute>
                }
              />

              <Route
                path="/conducteur/annonces"
                element={
                  <PrivateRoute requiredRole="conducteur">
                    <AnnoncesConducteur />
                  </PrivateRoute>
                }
              />

              <Route
                path="/conducteur/trajets"
                element={
                  <PrivateRoute requiredRole="conducteur">
                    <MesTrajets />
                  </PrivateRoute>
                }
              />

              <Route
                path="/demandes-recues"
                element={
                  <PrivateRoute requiredRole="conducteur">
                    <DemandesRecues />
                  </PrivateRoute>
                }
              />
              <Route
                path="/expediteur/trajets"
                element={
                  <PrivateRoute requiredRole="expediteur">
                    <TrajetsDisponibles />
                  </PrivateRoute>
                }
              />

              <Route
                path="/expediteur/demandes"
                element={
                  <PrivateRoute requiredRole="expediteur">
                    <MesDemandes />
                  </PrivateRoute>
                }
              />

           
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardAdmin />
                  </AdminRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
