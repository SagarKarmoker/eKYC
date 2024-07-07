const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
    nid: { type: String, required: true },
    reason: { type: String, required: true },
    nonce: { type: Number, required: true },
    gasPrice: { type: String, required: true },  // Storing BigNumber as a string
    gasLimit: { type: String, required: true },  // Storing BigNumber as a string
    to: { type: String, required: true },
    value: { type: String, required: true },     // Storing BigNumber as a string
    data: { type: String, required: true },
    chainId: { type: Number, required: true },
    v: { type: Number, required: true },
    r: { type: String, required: true },
    s: { type: String, required: true },
    from: { type: String, required: true },
    hash: { type: String, required: true },
    type: { type: Schema.Types.Mixed, default: null }, // Mixed type for optional fields
    confirmations: { type: Number, default: 0 },
    wait: { type: Schema.Types.Mixed, default: null }, // Placeholder for the wait function
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
