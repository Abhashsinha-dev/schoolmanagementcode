const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  profile: { type: Object, required: false },
});

const School = mongoose.model("School", SchoolSchema);
module.exports = School;
