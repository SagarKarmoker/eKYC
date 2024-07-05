const mongoose = require("mongoose");

const shardKeySchema = new mongoose.Schema({
  nidNumber: { type: String, required: true, unique: true },
  shardB: { type: String, required: true }
}, 
{timestamps: true});

const shardKey = mongoose.model("ShardKey", shardKeySchema);
module.exports = { shardKey };
