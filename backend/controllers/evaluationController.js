const Evaluation = require('../models/Evaluation');
const User = require('../models/User');
const Demande = require('../models/Demande');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

exports.createEvaluation = async (req, res) => {
  try {
    const { demandeId, note, commentaire } = req.body;
    const evaluateurId = req.user._id;

    const demande = await Demande.findById(demandeId).populate('trajet');

    if (!demande || !demande.trajet) {
      return res.status(404).json({ message: 'Demande ou trajet associé non trouvé.' });
    }

    if (demande.statut !== 'livree') {
      return res.status(400).json({ message: 'Vous ne pouvez évaluer qu\'une demande livrée.' });
    }

    const expediteurId = demande.expediteur;
    const conducteurId = demande.trajet.conducteur;

    const isExpediteur = expediteurId.toString() === evaluateurId.toString();
    const isConducteur = conducteurId.toString() === evaluateurId.toString();

    if (!isExpediteur && !isConducteur) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à évaluer cette demande.' });
    }

    const evalueId = isExpediteur ? conducteurId : expediteurId;

    if (evaluateurId.toString() === evalueId.toString()) {
      return res.status(400).json({ message: 'Vous ne pouvez pas vous évaluer vous-même.' });
    }

    const existingEvaluation = await Evaluation.findOne({
      demande: demandeId,
      evaluateur: evaluateurId
    });

    if (existingEvaluation) {
      return res.status(400).json({ message: 'Vous avez déjà évalué cette transaction.' });
    }

    const evaluation = await Evaluation.create({
      demande: demandeId,
      evaluateur: evaluateurId,
      evalue: evalueId,
      note,
      commentaire
    });
    
    await Notification.create({
        user: evalueId,
        message: `Vous avez reçu une nouvelle évaluation de ${req.user.prenom} ${req.user.nom}.`,
        type: 'general',
        link: '/evaluations'
    });

    res.status(201).json(evaluation);
  } catch (err) {
    console.error('Erreur lors de la création de l\'évaluation:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la création de l\'évaluation.' });
  }
};

exports.getEvaluationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const evaluations = await Evaluation.find({ evalue: userId })
      .populate('evaluateur', 'nom prenom')
      .sort({ createdAt: -1 });

    res.json(evaluations);
  } catch (err) {
    console.error('Erreur lors de la récupération des évaluations:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des évaluations.' });
  }
};

exports.getAverageRating = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await Evaluation.aggregate([
      { $match: { evalue: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$note' },
          totalEvaluations: { $sum: 1 }
        }
      }
    ]);

    const averageRating = result.length > 0 ? result[0].averageRating : 0;
    const totalEvaluations = result.length > 0 ? result[0].totalEvaluations : 0;

    res.json({
      averageRating: Math.round(averageRating * 10) / 10,
      totalEvaluations
    });
  } catch (err) {
    console.error('Erreur lors du calcul de la note moyenne:', err);
    res.status(500).json({ message: 'Erreur serveur lors du calcul de la note moyenne.' });
  }
};

exports.updateEvaluation = async (req, res) => {
  try {
    const { evaluationId } = req.params;
    const { note, commentaire } = req.body;
    const userId = req.user._id;

    const evaluation = await Evaluation.findById(evaluationId);

    if (!evaluation) {
      return res.status(404).json({ message: 'Évaluation non trouvée.' });
    }

    if (evaluation.evaluateur.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier cette évaluation.' });
    }
    evaluation.note = note;
    evaluation.commentaire = commentaire;
    evaluation.updatedAt = Date.now();

    await evaluation.save();
    await evaluation.populate('evaluateur', 'nom prenom');

    res.json(evaluation);
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l\'évaluation:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de l\'évaluation.' });
  }
};

exports.deleteEvaluation = async (req, res) => {
  try {
    const { evaluationId } = req.params;
    const userId = req.user._id;

    const evaluation = await Evaluation.findById(evaluationId);

    if (!evaluation) {
      return res.status(404).json({ message: 'Évaluation non trouvée.' });
    }
    if (evaluation.evaluateur.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer cette évaluation.' });
    }

    await Evaluation.findByIdAndDelete(evaluationId);

    res.json({ message: 'Évaluation supprimée avec succès.' });
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'évaluation:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de l\'évaluation.' });
  }
};

exports.getAllEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find()
      .populate('evaluateur', 'nom prenom email')
      .populate('evalue', 'nom prenom email')
      .sort({ createdAt: -1 });

    res.json(evaluations);
  } catch (err) {
    console.error('Erreur lors de la récupération de toutes les évaluations:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des évaluations.' });
  }
};

exports.getDemandesAevaluer = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié." });
    }

    const trajetsConducteur = await mongoose.model('Trajet').find({ conducteur: userId }).select('_id');
    const trajetsIds = trajetsConducteur.map(t => t._id);

    const demandesConcernees = await Demande.find({
      statut: 'livree',
      $or: [{ expediteur: userId }, { trajet: { $in: trajetsIds } }]
    })
      .populate({
        path: 'trajet',
        select: 'depart destination conducteur',
        populate: {
          path: 'conducteur',
          select: 'nom prenom'
        }
      })
      .populate('expediteur', 'nom prenom');

    const evaluationsFaites = await Evaluation.find({ evaluateur: userId }).select('demande');
    const demandesEvalueesIds = evaluationsFaites.map(ev => ev.demande.toString());

    const demandesAevaluer = demandesConcernees.filter(
      demande => !demandesEvalueesIds.includes(demande._id.toString())
    );

    res.json(demandesAevaluer);
  } catch (err) {
    console.error('Erreur détaillée dans getDemandesAevaluer:', err);
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

exports.getEvaluationsRecues = async (req, res) => {
  try {
    const evaluations = await Evaluation.find({ evalue: req.user._id })
      .populate('evaluateur', 'nom prenom')
      .populate({
        path: 'demande',
        select: 'trajet',
        populate: {
          path: 'trajet',
          select: 'depart destination'
        }
      })
      .sort({ createdAt: -1 });

    res.json(evaluations);
  } catch (err) {
    console.error('Erreur lors de la récupération des évaluations reçues:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des évaluations reçues.' });
  }
};

exports.getEvaluationsDonnees = async (req, res) => {
  try {
    const evaluations = await Evaluation.find({ evaluateur: req.user._id })
      .populate('evalue', 'nom prenom')
      .sort({ createdAt: -1 });

    res.json(evaluations);
  } catch (err) {
    console.error('Erreur lors de la récupération des évaluations données:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des évaluations données.' });
  }
}; 