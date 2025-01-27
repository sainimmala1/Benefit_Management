const express = require('express');
const router = express.Router();
const {showRequests,createRequest,deleteRequest,showRequestsbyid,updateRequest}= require('../controllers/requestControllers');


router.get('/show', showRequests);
router.post('/create', createRequest);
router.get('/show/:id', showRequestsbyid);
router.put('/update/:id', updateRequest);
router.delete('/delete/:id', deleteRequest);
module.exports = router;

