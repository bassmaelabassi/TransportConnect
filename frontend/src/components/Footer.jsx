import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#adc178] to-[#a98467] text-[#6c584c] py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">TransportConnect</h3>
            <p className="text-[#f0ead2] text-sm">
              La plateforme qui connecte conducteurs et expéditeurs pour un transport de colis efficace et sécurisé.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/expediteur/trajets" className="hover:text-[#a98467] transition-colors">
                  Transport de colis
                </Link>
              </li>
              <li>
                <Link to="/conducteur/annonces" className="hover:text-[#a98467] transition-colors">
                  Publier un trajet
                </Link>
              </li>
              <li>
                <Link to="/evaluations" className="hover:text-[#a98467] transition-colors">
                  Système d'évaluation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-[#a98467] transition-colors">
                  Centre d'aide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#a98467] transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#a98467] transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-[#a98467] transition-colors">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#a98467] transition-colors">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#a98467] transition-colors">
                  Mentions légales
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#dde5b6] mt-8 pt-8 text-center">
          <p className="text-[#f0ead2] text-sm">© 2024 TransportConnect. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
