const Trajet = require('../models/Trajet');

exports.createTrajet = async (req, res) => {
  try {
    const { depart, etapes, destination, dimensionsMax, typeMarchandise, capaciteDisponible } = req.body;

    const trajet = await Trajet.create({
      conducteur: req.user._id,
      depart,
      etapes,
      destination,
      dimensionsMax,
      typeMarchandise,
      capaciteDisponible
    });

    res.status(201).json(trajet);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création du trajet' });
  }
};

exports.getTrajets = async (req, res) => {
  try {
    const trajets = await Trajet.find().populate('conducteur', 'nom prenom email role badgeVerifie');
    res.json(trajets);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des trajets' });
  }
};

exports.getMyTrajets = async (req, res) => {
  try {
    const mesTrajets = await Trajet.find({ conducteur: req.user._id });
    res.json(mesTrajets);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de vos trajets' });
  }
};

exports.deleteTrajet = async (req, res) => {
  try {
    const { id } = req.params;
    const trajet = await Trajet.findById(id);
    
    if (!trajet) {
      return res.status(404).json({ message: 'Trajet non trouvé' });
    }

    if (req.user.role !== 'admin' && trajet.conducteur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé - Vous n\'êtes pas autorisé à supprimer ce trajet' });
    }

    await Trajet.findByIdAndDelete(id);
    res.json({ message: 'Trajet supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression du trajet' });
  }
};
