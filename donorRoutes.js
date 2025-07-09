const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const Donor = require('./donor');
const router = express.Router();

// Converts symbols like '+' and '−' to words for safe storage/search
const convertBloodType = (bloodType) => {
    const map = {
        'A+': 'Apositive',
        'A−': 'Anegative',
        'B+': 'Bpositive',
        'B−': 'Bnegative',
        'AB+': 'ABpositive',
        'AB−': 'ABnegative',
        'O+': 'Opositive',
        'O−': 'Onegative'
    };
    return map[bloodType] || bloodType;
};

// Add donor route
router.post('/add', async (req, res) => {
    try {
        const { name, email, contact, bloodType, district } = req.body;

        const donor = new Donor({
            name: name ? name.trim() : name,
            email: email ? email.trim() : email,
            contact: contact ? contact.trim() : contact,
            bloodType: convertBloodType(bloodType),
            district: district ? district.trim() : district
        });

        await donor.save();
        res.status(201).json({ message: "Successfully added donor" });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Search donor route
router.get('/search', async (req, res) => {
    let { bloodType, district } = req.query;

    console.log('Received Search Query:', bloodType, district);

    if (!bloodType || !district) {
        return res.status(400).json({ error: 'Both bloodType and district are required.' });
    }

    bloodType = convertBloodType(bloodType);

    try {
        const results = await Donor.find({
            bloodType: bloodType.trim(),
            district: district.trim()
        });
        console.log('Matched Donors:', results);
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
