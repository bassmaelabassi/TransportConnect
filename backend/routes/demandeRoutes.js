const express = require('express');
const router = express.Router();
const {
  createDemande,
  getDemandesForConducteur,
  updateDemandeStatus,
  getHistoriqueDemandes,
  deleteDemande,
  getMesDemandes,
  getDemandesRecues,
  accepterDemande,
  refuserDemande,
  marquerCommeLivree,
} = require('../controllers/demandeControllers');

const protect = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/', protect, roleMiddleware(['expediteur']), createDemande);
router.get('/conducteur', protect, roleMiddleware(['conducteur']), getDemandesForConducteur);
router.get('/mes-demandes', protect, getMesDemandes);
router.get('/recues', protect, roleMiddleware(['conducteur']), getDemandesRecues);
router.put('/:id', protect, roleMiddleware(['conducteur']), updateDemandeStatus);
router.get('/historique', protect, roleMiddleware(['expediteur']), getHistoriqueDemandes);
router.delete('/:id', protect, roleMiddleware(['expediteur']), deleteDemande);
router.post('/:id/accepter', protect, roleMiddleware(['conducteur']), accepterDemande);
router.post('/:id/refuser', protect, roleMiddleware(['conducteur']), refuserDemande);
router.post('/:id/livrer', protect, roleMiddleware(['conducteur']), marquerCommeLivree);

module.exports = router;
