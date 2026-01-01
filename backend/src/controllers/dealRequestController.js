const DealRequest = require('../models/DealRequest');
const Deal = require('../models/Deal');

exports.createDealRequest = async (req, res) => {
    try {
        const { dealId, user } = req.body;

        if (!dealId || !user || !user.name || !user.email || !user.phone) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate Name (letters and spaces only)
        if (!/^[a-zA-Z\s]+$/.test(user.name)) {
            return res.status(400).json({ message: 'Name must contain only letters' });
        }

        // Validate Email (specific domains only)
        const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
        const emailDomain = user.email.split('@')[1];
        if (!allowedDomains.includes(emailDomain)) {
            return res.status(400).json({ message: 'Email must be from gmail, yahoo, outlook, or hotmail' });
        }

        const deal = await Deal.findById(dealId);
        if (!deal) {
            return res.status(404).json({ message: 'Deal not found' });
        }

        const newRequest = await DealRequest.create({
            dealId,
            user
        });

        res.status(201).json(newRequest);
    } catch (error) {
        console.error('Error creating deal request:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getDealRequests = async (req, res) => {
    try {
        const { sortOrder = 'desc' } = req.query;
        const sortDirection = sortOrder === 'asc' ? 1 : -1;

        const requests = await DealRequest.find()
            .populate('dealId', 'title')
            .sort({ createdAt: sortDirection });

        res.json(requests);
    } catch (error) {
        console.error('Error fetching deal requests:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateDealRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'contacted', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const request = await DealRequest.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('dealId', 'title');

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.json(request);
    } catch (error) {
        console.error('Error updating deal request status:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
