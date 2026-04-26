const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const authMiddleware = require('../middleware/auth');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// GET all images
router.get('/images', authMiddleware, async (req, res) => {
    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'admin_assets',
            max_results: 100,
            resource_type: 'image'
        });
        res.json(result.resources);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE image 
router.delete('/delete', authMiddleware, async (req, res) => {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ error: 'public_id is required' });
    try {
        const result = await cloudinary.uploader.destroy(public_id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
