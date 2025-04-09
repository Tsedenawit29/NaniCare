// backend/controllers/momsController.js
const User = require('../models/userModel');
const NannyProfile = require('../models/nannyProfileModel'); // If you have a separate model

exports.searchNannies = async (req, res) => {
    const { location, availability } = req.query;
    try {
        let whereClause = { role: 'nanny' };
        if (location) {
            whereClause.location = location; // Basic string matching for MVP
        }

        const nannies = await User.findAll(whereClause);
        const nannyProfiles = await NannyProfile.findAll({
            where: {
                user_id: nannies.map(n => n.id),
                ...(availability ? { is_available: availability === 'available' } : {}),
            },
        });

        // Merge user data with profile data
        const results = nannies.map(nanny => {
            const profile = nannyProfiles.find(p => p.user_id === nanny.id);
            return {
                id: nanny.id,
                name: nanny.name,
                generalLocation: nanny.location,
                ...profile?.dataValues, // Spread profile data (is_certified, rating, etc.)
            };
        });

        res.json(results);
    } catch (error) {
        console.error('Error searching nannies:', error);
        res.status(500).json({ error: 'Failed to search nannies' });
    }
};