const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: false,
  },
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
    required: false,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  profile: { type: Object, required: false },
});

const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;
