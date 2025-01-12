const transferStudent = async (req, res) => {
    try {
      const { studentId, fromClassroomId, toClassroomId } = req.body;
  
      // Check if the student exists
      const student = await Student.findById(studentId);
      if (!student) return res.status(404).json({ message: 'Student not found' });
  
      // Check if the 'from' and 'to' classrooms exist
      const fromClassroom = await Classroom.findById(fromClassroomId);
      const toClassroom = await Classroom.findById(toClassroomId);
      if (!fromClassroom || !toClassroom) return res.status(404).json({ message: 'Classroom(s) not found' });
  
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
  
  module.exports = { transferStudent };
  