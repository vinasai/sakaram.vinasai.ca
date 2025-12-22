const express = require('express');
const router = express.Router();
const dealRequestController = require('../controllers/dealRequestController');

// POST /api/deal-requests - Create a new request
router.post('/', dealRequestController.createDealRequest);

// GET /api/deal-requests - Get all requests
router.get('/', dealRequestController.getDealRequests);

// PUT /api/deal-requests/:id/status - Update status
router.put('/:id/status', dealRequestController.updateDealRequestStatus);

module.exports = router;
