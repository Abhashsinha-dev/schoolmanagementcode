const School = require("../models/school");
const User = require("../models/user");
const createSchool = async (req, res) => {
  try {
    const { name, address } = req.body;
    const newSchool = new School({
      name,
      address,
    });
    await newSchool.save();
    res.status(201).json(newSchool);
  } catch (err) {
    res.status(500).json({ message: "Error creating school" });
  }
};
const getAllSchools = async (req, res) => {
  try {
    const schools = await School.find(); // Retrieve all schools from the database
    res.status(200).json(schools);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving schools" });
  }
};
const updateSchoolProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address } = req.body;
    const school = await School.findByIdAndUpdate(
      id,
      { name, address },
      { new: true }
    );
    if (!school) return res.status(404).json({ message: "School not found" });
    res.status(200).json(school);
  } catch (err) {
    res.status(500).json({ message: "Error updating school" });
  }
};

const deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const school = await School.findByIdAndDelete(id);
    if (!school) return res.status(404).json({ message: "School not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Error deleting school" });
  }
};

module.exports = { createSchool, updateSchoolProfile, deleteSchool , getAllSchools};
