const Classroom = require("../models/classroom");
const School = require("../models/school");

const getAllClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find(); 
    res.status(200).json(classrooms);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving classrooms" });
  }
};
const createClassroom = async (req, res) => {
  try {
    const { name, capacity, resources, school_id } = req.body;
    

    const classroom = new Classroom({
      school_id: school_id,
      name,
      capacity,
      resources,
    });
    const school = await School.findById(school_id);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    await classroom.save();
    res.status(201).json(classroom);
  } catch (err) {
    console.log("Error:", err.message);
    res.status(500).json({ message: "Error creating classroom" });
  }
};

// Update Classroom
const updateClassroom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacity, resources } = req.body;

    const classroom = await Classroom.findByIdAndUpdate(
      id,
      { name, capacity, resources },
      { new: true }
    );

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    res.status(200).json(classroom);
  } catch (err) {
    console.log("Error:", err.message);
    res.status(500).json({ message: "Error updating classroom" });
  }
};

// Delete Classroom
const deleteClassroom = async (req, res) => {
  try {
    const { id } = req.params;
    const classroom = await Classroom.findByIdAndDelete(id);

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.log("Error:", err.message);
    res.status(500).json({ message: "Error deleting classroom" });
  }
};

module.exports = { createClassroom, updateClassroom, deleteClassroom, getAllClassrooms };
