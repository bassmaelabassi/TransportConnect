import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import NotificationBell from "./NotificationBell"
import { useState } from "react"

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isConducteur, isExpediteur } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="bg-gradient-to-r from-[#adc178] to-[#a98467] border-b border-[#dde5b6] px-4 py-3 shadow-sm sticky top-0 z-40">
      <div className="container-max flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-[#6c584c] tracking-tight">
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #a98467, #6c584c)' }}>TransportConnect</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            {!isAuthenticated && (
              <>
                <Link to="/login" className="text-[#6c584c] hover:text-[#a98467] font-medium transition-colors">Connexion</Link>
                <Link to="/register" className="px-4 py-2 rounded-md bg-gradient-to-r from-[#a98467] to-[#6c584c] text-white font-semibold hover:from-[#6c584c] hover:to-[#a98467] transition-all shadow">S'inscrire</Link>
              </>
            )}
            {isAuthenticated && (
              <>
                {isAdmin && (
                  <Link to="/admin/dashboard" className="text-[#6c584c] hover:text-[#a98467] font-medium transition-colors">Administration</Link>
                )}
                {isConducteur && !isAdmin && (
                  <>
                    <Link to="/conducteur/annonces" className="text-[#6c584c] hover:text-[#a98467] font-medium transition-colors">Mes Annonces</Link>
                    <Link to="/conducteur/trajets" className="text-[#6c584c] hover:text-[#a98467] font-medium transition-colors">Mes Trajets</Link>
                    <Link to="/demandes-recues" className="text-[#6c584c] hover:text-[#a98467] font-medium transition-colors">Demandes Reçues</Link>
                  </>
                )}
                {isExpediteur && !isAdmin && (
                  <>
                    <Link to="/expediteur/trajets" className="text-[#6c584c] hover:text-[#a98467] font-medium transition-colors">Trajets Disponibles</Link>
                  </>
                )}
                <Link to="/evaluations" className="text-[#6c584c] hover:text-[#a98467] font-medium transition-colors">Évaluations</Link>
              </>
            )}
          </div>
        </div>
        <div className="md:hidden flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none bg-[#a98467] hover:bg-[#6c584c] p-2 rounded-md transition-all">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        {isAuthenticated && (
          <div className="hidden md:flex items-center space-x-4">
            <NotificationBell />
            <div className="relative group">
              <button className="flex items-center space-x-2 text-[#6c584c] hover:text-[#a98467] transition-colors">
                <div className="w-9 h-9 bg-[#adc178] rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
                </div>
                <span className="hidden md:inline font-medium">
                  {user?.prenom} {user?.nom}
                </span>
                {user?.role && (
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold capitalize bg-[#dde5b6] text-[#6c584c] border border-[#adc178]">{user.role}</span>
                )}
              </button>
              <div className="absolute right-0 mt-2 w-52 bg-white border border-[#dde5b6] rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link to="/profile" className="block px-4 py-2 text-sm text-[#6c584c] hover:bg-[#dde5b6]">Mon Profil</Link>
                <Link to="/notifications" className="block px-4 py-2 text-sm text-[#6c584c] hover:bg-[#dde5b6]">Notifications</Link>
                <hr className="my-1 border-[#dde5b6]" />
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-[#6c584c] hover:bg-[#dde5b6]"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white border border-[#dde5b6] rounded-b-xl shadow-lg mt-2 py-4 px-4 space-y-2 animate-fade-in-down">
          {!isAuthenticated && (
            <>
              <Link to="/login" className="block text-[#6c584c] hover:text-[#a98467] font-medium transition-colors">Connexion</Link>
              <Link to="/register" className="block px-4 py-2 rounded-md bg-gradient-to-r from-[#a98467] to-[#6c584c] text-white font-semibold hover:from-[#6c584c] hover:to-[#a98467] transition-all shadow">S'inscrire</Link>
            </>
          )}
          {isAuthenticated && (
            <>
              {isAdmin && (
                <Link to="/admin/dashboard" className="block text-[#6c584c] hover:text-[#a98467] font-medium transition-colors">Administration</Link>
              )}
              {isConducteur && !isAdmin && (
                <>
                  <Link to="/conducteur/annonces" className="block text-[#6c584c] hover:text-[#a98467] font-medium transition-colors">Mes Annonces</Link>
                  <Link to="/conducteur/trajets" className="block text-[#6c584c] hover:text-[#a98467] font-medium transition-colors">Mes Trajets</Link>
                  <Link to="/demandes-recues" className="block text-[#6c584c] hover:text-[#a98467] font-medium transition-colors">Demandes Reçues</Link>
                </>
              )}
              {isExpediteur && !isAdmin && (
                <>
                  <Link to="/expediteur/trajets" className="block text-[#6c584c] hover:text-[#a98467] font-medium transition-colors">Trajets Disponibles</Link>
                </>
              )}
              <Link to="/evaluations" className="block text-[#6c584c] hover:text-[#a98467] font-medium transition-colors">Évaluations</Link>
              <Link to="/profile" className="block text-[#6c584c] hover:text-[#a98467] font-medium transition-colors">Mon Profil</Link>
              <Link to="/notifications" className="block text-[#6c584c] hover:text-[#a98467] font-medium transition-colors">Notifications</Link>
              <button onClick={handleLogout} className="block w-full text-left text-red-600 mt-2">Se déconnecter</button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
