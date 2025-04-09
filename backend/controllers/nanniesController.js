// backend/controllers/nanniesController.js
const User = require('../models/userModel');
const NannyProfile = require('../models/nannyProfileModel'); // If you have a separate model

exports.getProfile = async (req, res) => {
    // For MVP, we'll assume a logged-in nanny (you'll need to handle authentication properly later)
    const nannyId = 3; // Example nanny ID - replace with actual auth logic
    try {
        const user = await User.findById(nannyId);
        const profile = await NannyProfile.findOne({ where: { user_id: nannyId } });
        if (!user) {
            return res.status(404).json({ error: 'Nanny profile not found' });
        }
        res.json({ ...user.dataValues, ...profile?.dataValues });
    } catch (error) {
        console.error('Error fetching nanny profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

exports.updateProfile = async (req, res) => {
    // For MVP, assume logged-in nanny
    const nannyId = 3; // Example nanny ID
    const { aboutMe } = req.body;
    try {
        await NannyProfile.update({ about_me: aboutMe }, { where: { user_id: nannyId } });
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating nanny profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

exports.updateAvailability = async (req, res) => {
    // For MVP, assume logged-in nanny
    const nannyId = 3; // Example nanny ID
    const { isAvailable } = req.body;
    try {
        await NannyProfile.update({ is_available: isAvailable }, { where: { user_id: nannyId } });
        res.json({ message: 'Availability updated successfully' });
    } catch (error) {
        console.error('Error updating availability:', error);
        res.status(500).json({ error: 'Failed to update availability' });
    }
};