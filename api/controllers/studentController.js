const Student = require('../models/student');
const Classroom = require('../models/classroom');

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find(); 
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving students" });
  }
};
const createStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, school_id } = req.body;
    const student = new Student({
      school: school_id,
      firstName,
      lastName,
      email,
    });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: 'Error creating student' });
  }
};

const transferStudent = async (req, res) => {
  try {
    const { studentId, fromClassroomId, toClassroomId } = req.body;

    // Check if the 'from' and 'to' classrooms exist
    const fromClassroom = await Classroom.findById(fromClassroomId);
    const toClassroom = await Classroom.findById(toClassroomId);
    if (!fromClassroom || !toClassroom) return res.status(404).json({ message: 'Classroom(s) not found' });
const classroom =toClassroomId;
    const student = await Student.findByIdAndUpdate(
      studentId,
      { classroom },
      { new: true }
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(student);
    // Remove the student from the original classroom
    const classroomIndex = student.classrooms.indexOf(fromClassroomId);
    if (classroomIndex > -1) {
      student.classrooms.splice(classroomIndex, 1);  // Remove from `fromClassroomId`
    }

    // Add the student to the new classroom
    student.classrooms.push(toClassroomId);  // Add to `toClassroomId`

    await student.save();  // Save the student with updated classrooms

    res.status(200).json({ message: 'Student transferred successfully', student });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Error transferring student' });
  }
};

const enrollStudent = async (req, res) => {
  try {
    const { studentId, classroomId } = req.body;  // Assuming you're sending student ID and classroom ID

    // Check if the classroom exists
    const getclassroom = await Classroom.findById(classroomId);
    if (!getclassroom) return res.status(404).json({ message: 'Classroom not found' });

    const classroom =classroomId;
    const student = await Student.findByIdAndUpdate(
      studentId,
      { classroom },
      { new: true }
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(student);
    // Enroll the student in the classroom (Assuming the student has a `classrooms` field)
    student.classrooms.push(classroomId);  // Add classroom to student's enrolled classrooms
    await student.save();  // Save the student

    res.status(200).json({ message: 'Student enrolled successfully', student });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Error enrolling student' });
  }
};


module.exports = { createStudent, transferStudent, enrollStudent, getAllStudents };
