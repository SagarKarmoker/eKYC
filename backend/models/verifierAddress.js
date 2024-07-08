const mongoose = require('mongoose');
const { Schema } = mongoose;

const verifierAddressSchema = new Schema({
    orgName: { type: String, required: true },
    address: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    hash: { type: String, required: true },
    addedOn: { type: Number, required: true}
}, { timestamps: true });

const Verifier = mongoose.model('Verifier', verifierAddressSchema);

module.exports = Verifier;
