const express = require('express');
const { registerUser, loginUser,getAllRegisters ,deleteRegister} = require('../controllers/userControllers');
const router = express.Router();

// Register Route
router.post('/register', registerUser);
// Login Route
router.post('/login', loginUser);


router.get('/getregisters',getAllRegisters );
router.delete('/deleteRegister/:id',deleteRegister);

module.exports = router;
