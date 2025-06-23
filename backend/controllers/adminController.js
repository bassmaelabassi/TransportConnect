const User = require('../models/User');
const Trajet = require('../models/Trajet');
const Demande = require('../models/Demande');
const Notification = require('../models/Notification');

exports.getStats = async (req, res) => {
  try {
    const nbAnnonces = await Trajet.countDocuments();
    const nbDemandes = await Demande.countDocuments();
    const nbUtilisateurs = await User.countDocuments();
    const nbConducteurs = await User.countDocuments({ role: 'conducteur' });
    const nbExpediteurs = await User.countDocuments({ role: 'expediteur' });
    const nbActifs = await User.countDocuments({ status: 'active' });
    const nbAccept = await Demande.countDocuments({ statut: 'acceptee' });
    const nbTotalDemandes = await Demande.countDocuments();
    const tauxAccept = nbTotalDemandes ? (nbAccept / nbTotalDemandes) * 100 : 0;

    res.json({
      nbAnnonces,
      nbDemandes,
      nbUtilisateurs,
      nbConducteurs,
      nbExpediteurs,
      nbActifs,
      tauxAccept: Math.round(tauxAccept * 10) / 10,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
};

exports.getRecentAnnonces = async (req, res) => {
  try {
    const annonces = await Trajet.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('conducteur', 'nom prenom')
      .select('conducteur depart destination date statut createdAt');
    res.json(annonces);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des annonces récentes' });
  }
};

exports.getRecentUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['conducteur', 'expediteur'] } })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('nom prenom email role status badgeVerifie createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs récents' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, badgeVerifie } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    if (status) user.status = status;
    if (typeof badgeVerifie === 'boolean') user.badgeVerifie = badgeVerifie;
    await user.save();
    await Notification.create({
      user: user._id,
      message: `Votre statut a été mis à jour par l'administrateur.`,
      type: 'admin',
      link: '/profile'
    });
    res.json(user);
  } catch (err) {
    console.error('Erreur updateUserStatus:', err);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
  }
};

exports.deleteAnnonce = async (req, res) => {
  try {
    await Trajet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Annonce supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};

exports.updateAnnonce = async (req, res) => {
  try {
    const annonce = await Trajet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(annonce);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la modification' });
  }
};

exports.getUsersByRole = async (req, res) => {
  console.log("getUsersByRole called with role:", req.params.role);
  try {
    const { role } = req.params;
    if (!['conducteur', 'expediteur'].includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide' });
    }
    const users = await User.find({ role }).select('nom prenom email status createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
}; 