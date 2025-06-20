  const User = require('../models/User');
const Trajet = require('../models/Trajet');
const Demande = require('../models/Demande');

exports.getStats = async (req, res) => {
  try {
    const nbAnnonces = await Trajet.countDocuments();
    const nbDemandes = await Demande.countDocuments();
    const nbUtilisateurs = await User.countDocuments({ role: { $in: ['conducteur', 'expediteur'] } });
    const nbActifs = await User.countDocuments({ status: 'active' });
    const nbAccept = await Demande.countDocuments({ statut: 'acceptee' });
    const nbTotalDemandes = await Demande.countDocuments();
    const tauxAccept = nbTotalDemandes ? (nbAccept / nbTotalDemandes) * 100 : 0;

    res.json({
      nbAnnonces,
      nbDemandes,
      nbUtilisateurs,
      nbActifs,
      tauxAccept: Math.round(tauxAccept * 10) / 10,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
}; 