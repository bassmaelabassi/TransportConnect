const Demande = require('../models/Demande');
const Trajet = require('../models/Trajet');
const Notification = require('../models/Notification');

exports.createDemande = async (req, res) => {
  try {
    const { trajetId, dimensions, poids, typeColis, details } = req.body;

    const trajet = await Trajet.findById(trajetId);
    if (!trajet) {
      return res.status(404).json({ message: 'Trajet non trouvé' });
    }

    const demande = await Demande.create({
      expediteur: req.user._id,
      trajet: trajetId,
      dimensions,
      poids,
      typeColis,
      details,
    });

    trajet.demandesAssociees.push(demande._id);
    await trajet.save();

    await Notification.create({
      user: trajet.conducteur,
      message: `Nouvelle demande de transport de ${req.user.prenom} ${req.user.nom} pour votre trajet ${trajet.depart} → ${trajet.destination}`,
      type: 'demande',
      relatedDemande: demande._id,
      link: '/demandes-recues',
      actions: [
        {
          label: 'Voir la demande',
          action: 'view',
          url: '/demandes-recues'
        },
        {
          label: 'Accepter',
          action: 'accept',
          url: `/demandes/${demande._id}/accepter`
        },
        {
          label: 'Refuser',
          action: 'refuse',
          url: `/demandes/${demande._id}/refuser`
        }
      ]
    });

    res.status(201).json(demande);
  } catch (err) {
    console.error("Erreur createDemande:", err);
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
    const trajets = await Trajet.find({ conducteur: req.user._id }).select('_id');
    const demandes = await Demande.find({ trajet: { $in: trajets.map(t => t._id) } })
      .populate('expediteur', 'nom prenom email')
      .populate('trajet');
    res.json(demandes);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des demandes reçues' });
  }
};

exports.accepterDemande = async (req, res) => {
  try {
    const demande = await Demande.findById(req.params.id).populate('expediteur').populate('trajet');
    if (!demande) return res.status(404).json({ message: "Demande non trouvée" });
    demande.statut = "acceptee";
    await demande.save();
    
    await Notification.create({
      user: demande.expediteur._id,
      message: `Votre demande pour le trajet ${demande.trajet.depart} → ${demande.trajet.destination} a été acceptée !`,
      type: 'acceptation',
      relatedDemande: demande._id,
      link: '/mes-demandes',
      actions: [
        {
          label: 'Voir les détails',
          action: 'view',
          url: '/mes-demandes'
        }
      ]
    });
    
    res.json({ message: "Demande acceptée", demande });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'acceptation de la demande" });
  }
};

exports.refuserDemande = async (req, res) => {
  try {
    const demande = await Demande.findById(req.params.id).populate('expediteur').populate('trajet');
    if (!demande) return res.status(404).json({ message: "Demande non trouvée" });
    demande.statut = "refusee";
    await demande.save();
    
    await Notification.create({
      user: demande.expediteur._id,
      message: `Votre demande pour le trajet ${demande.trajet.depart} → ${demande.trajet.destination} a été refusée.`,
      type: 'refus',
      relatedDemande: demande._id,
      link: '/mes-demandes',
      actions: [
        {
          label: 'Voir les détails',
          action: 'view',
          url: '/mes-demandes'
        }
      ]
    });
    
    res.json({ message: "Demande refusée", demande });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors du refus de la demande" });
  }
};

exports.marquerCommeLivree = async (req, res) => {
  try {
    const demande = await Demande.findById(req.params.id).populate('expediteur').populate('trajet');

    if (!demande) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }

    if (demande.trajet.conducteur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Action non autorisée" });
    }

    demande.statut = "livree";
    await demande.save();

    await Notification.create({
      user: demande.expediteur._id,
      message: `Votre colis pour le trajet ${demande.trajet.depart} → ${demande.trajet.destination} a bien été livré. N'oubliez pas d'évaluer le conducteur !`,
      type: 'evaluation',
      relatedDemande: demande._id,
      link: `/evaluations`,
      actions: [{ label: 'Évaluer', action: 'evaluate', url: `/evaluations` }]
    });

    res.json({ message: "Demande marquée comme livrée", demande });
  } catch (err) {
    console.error("Erreur marquerCommeLivree:", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la demande" });
  }
};

