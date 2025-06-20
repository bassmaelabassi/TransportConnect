const Demande = require('../models/Demande');
const Trajet = require('../models/Trajet');

exports.createDemande = async (req, res) => {
  try {
    const { trajetId, dimensions, poids, typeColis } = req.body;

    const demande = await Demande.create({
      expediteur: req.user._id,
      trajet: trajetId,
      dimensions,
      poids,
      typeColis,
    });

    await Trajet.findByIdAndUpdate(trajetId, {
      $push: { demandesAssociees: demande._id },
    });

    res.status(201).json(demande);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de la demande' });
  }
};

exports.getDemandesForConducteur = async (req, res) => {
  try {
    const demandes = await Demande.find()
      .populate({
        path: 'trajet',
        match: { conducteur: req.user._id }
      })
      .populate('expediteur');

    const filtered = demandes.filter(d => d.trajet !== null);
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des demandes' });
  }
};

exports.updateDemandeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    const updated = await Demande.findByIdAndUpdate(id, { statut }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la demande" });
  }
};

exports.getHistoriqueDemandes = async (req, res) => {
  try {
    const historiques = await Demande.find({ expediteur: req.user._id }).populate('trajet');
    res.json(historiques);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'historique" });
  }
};

exports.deleteDemande = async (req, res) => {
  try {
    const { id } = req.params;
    
    const demande = await Demande.findById(id);
    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    if (demande.expediteur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé à supprimer cette demande' });
    }

    if (demande.trajet) {
      await Trajet.findByIdAndUpdate(demande.trajet, {
        $pull: { demandesAssociees: demande._id }
      });
    }
    await Demande.findByIdAndDelete(id);
    
    res.json({ message: 'Demande supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la demande' });
  }
};

exports.getMesDemandes = async (req, res) => {
  try {
    const demandes = await Demande.find({ expediteur: req.user._id })
      .populate({
        path: 'trajet',
        populate: {
          path: 'conducteur',
          select: 'nom prenom'
        }
      });
    res.json(demandes);
  } catch (err) {
    console.error('Erreur getMesDemandes:', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des demandes' });
  }
};

exports.getDemandesRecues = async (req, res) => {
  try {
    // Récupérer les trajets du conducteur
    const trajets = await Trajet.find({ conducteur: req.user._id }).select('_id');
    // Récupérer les demandes associées à ces trajets
    const demandes = await Demande.find({ trajet: { $in: trajets.map(t => t._id) } })
      .populate('expediteur', 'nom prenom email')
      .populate('trajet');
    res.json(demandes);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des demandes reçues' });
  }
};

