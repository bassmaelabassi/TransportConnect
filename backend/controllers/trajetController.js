const Trajet = require('../models/Trajet');

exports.createTrajet = async (req, res) => {
  try {
    const { 
      depart, destination, etapes, date, heure, 
      capacite, dimensions, typeMarchandise, prix, description 
    } = req.body;

    const trajet = await Trajet.create({
      conducteur: req.user._id,
      depart,
      destination,
      etapes,
      date,
      heure,
      capacite,
      dimensions,
      typeMarchandise,
      prix,
      description
    });

    res.status(201).json(trajet);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création du trajet' });
  }
};

exports.getTrajets = async (req, res) => {
  try {
    const { depart, destination, date, typeColis } = req.query;
    const filter = {};

    if (depart) filter.depart = { $regex: depart, $options: "i" };
    if (destination) filter.destination = { $regex: destination, $options: "i" };
    if (date) filter.date = date;
    if (typeColis) filter.typeMarchandise = { $regex: typeColis, $options: "i" };

    const trajets = await Trajet.find(filter).populate('conducteur', 'nom prenom email role badgeVerifie');
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

exports.updateTrajet = async (req, res) => {
  try {
    const { id } = req.params;
    const trajet = await Trajet.findById(id);

    if (!trajet) {
      return res.status(404).json({ message: 'Trajet non trouvé' });
    }

    if (trajet.conducteur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    const updatedTrajet = await Trajet.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedTrajet);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du trajet' });
  }
};
