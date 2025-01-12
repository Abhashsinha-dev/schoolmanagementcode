const Student = require('../models/student');
const Classroom = require('../models/classroom');

const enrollStudent = async (req, res) => {
  try {
    const { studentId, classroomId } = req.body;  // Assuming you're sending student ID and classroom ID

    // Check if the student exists
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Check if the classroom exists
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) return res.status(404).json({ message: 'Classroom not found' });

    // Enroll the student in the classroom (Assuming the student has a `classrooms` field)
    student.classrooms.push(classroomId);  // Add classroom to student's enrolled classrooms
    await student.save();  // Save the student

    res.status(200).json({ message: 'Student enrolled successfully', student });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Error enrolling student' });
  }
};

module.exports = { enrollStudent };
