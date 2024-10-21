// Require Dependencies
const mongoose = require("mongoose");
// Setup Hash Schema
const HashSchema = new mongoose.Schema({
  // Basic fields
  active: {
    type: Boolean,
    default: true,
  },
  hash: {
    type: String,
    required: true,
    unique: true,
  },
 // format 254722000000
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the new model
module.exports = mongoose.model("Hashes", HashSchema);
