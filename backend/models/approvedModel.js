const mongoose = require('mongoose');

const approvedSchema = new mongoose.Schema({
    nid: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    walletAddress: { type: String, required: true },
});

const Approved = mongoose.model('Approved', approvedSchema);

module.exports = Approved;