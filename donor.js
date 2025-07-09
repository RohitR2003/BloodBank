const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    name: String,
    email: String,
    contact: String,
    bloodType: String,
    district: String
});

module.exports = mongoose.model('Donor', donorSchema);