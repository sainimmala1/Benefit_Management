const express = require('express');
const { getBenefits, getBenefitById, createBenefit, updateBenefit, deleteBenefit } = require('../controllers/benefitcontrollers');
const { authenticateJWT } = require('../controllers/userControllers');
const router = express.Router();

// All benefits routes are protected by JWT
router.get('/getall', authenticateJWT, getBenefits);
router.get('/get/:id', authenticateJWT, getBenefitById);
router.post('/create', authenticateJWT, createBenefit);
router.put('/update/:id', authenticateJWT, updateBenefit);
router.delete('/delete/:id', authenticateJWT, deleteBenefit);

module.exports = router;



