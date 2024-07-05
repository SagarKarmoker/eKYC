const mongoose = require("mongoose");

const shardKeySchema = new mongoose.Schema({
  nidNumber: { type: String, required: true, unique: true },
  shardB: { type: String, required: true }
}, 
{timestamps: true});

const ShardKey = mongoose.model("ShardKey", shardKeySchema);
module.exports = ShardKey;
