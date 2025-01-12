const mongoose = require("mongoose");

const ClassroomSchema = new mongoose.Schema({
  school_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  resources: { type: [String], required: false },
});

const Classroom = mongoose.model("Classroom", ClassroomSchema);
module.exports = Classroom;
