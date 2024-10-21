// Require Dependencies
const mongoose = require("mongoose");
// Setup Hash Schema
const HashSchema = new mongoose.Schema({
  // Basic fields
  active: {
    type: Boolean,
    default: true,
  },
  hash: String,
 // format 254722000000
  phoneNumber: String,
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
