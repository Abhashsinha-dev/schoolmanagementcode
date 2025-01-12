const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');  // Import your Express app (make sure it's correctly exported)
const { MongoMemoryServer } = require('mongodb-memory-server');
const Student = require('../models/student');
const Classroom = require('../models/classroom');
const School = require('../models/school');
const jwt = require('jsonwebtoken');

let mongoServer;
let studentId;
let classroomId;
let schoolId;
let studentToken;

beforeAll(async () => {
   mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    const dbUri = process.env.MONGO_URI || mongoUri;
  
    if (mongoose.connection.readyState === 0) {
      console.log("DB_URI", dbUri);
      await mongoose.connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } else {
      console.log("Already connected to the database");
    }
  // Create a school for reference
  const school = await School.create({
    name: 'Test School',
    address: '123 School St',
  });
  schoolId = school._id;

  // Create a classroom for reference
  const classroom = await Classroom.create({
    name: 'Class A',
    capacity: 30,
    resources: ['projector', 'whiteboard'],
    school_id: schoolId,
  });
  classroomId = classroom._id;

  // Create a student for reference
  const student = await Student.create({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  });
  studentId = student._id;

  const studentToken = jwt.sign(
        { userId: "67813b1c79cd5de2fb26bf73", role: "student" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
});

afterAll(async () => {
  // Clean up in-memory database
  await mongoose.connection.close();
  //await mongoServer.stop();
});

describe('Student Controller', () => {
  // Test create student API
  it('should create a student', async () => {
    const response = await request(app)
      .post('/api/students')
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        school_id: schoolId,
      });

    expect(response.status).toBe(201);
    expect(response.body.firstName).toBe('Jane');
    expect(response.body.lastName).toBe('Doe');
    expect(response.body.email).toBe('jane.doe@example.com');
  });

  // Test transfer student API
  it('should transfer a student to a new classroom', async () => {
    const newClassroom = await Classroom.create({
      name: 'Class B',
      capacity: 30,
      resources: ['projector'],
      school_id: schoolId,
    });

    const response = await request(app)
      .put(`/api/students/transfer`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        studentId,
        fromClassroomId: classroomId,
        toClassroomId: newClassroom._id,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Student transferred successfully');
    expect(response.body.student.classrooms).toContainEqual(newClassroom._id);
  });

  // Test enroll student API
  it('should enroll a student in a classroom', async () => {
    const newClassroom = await Classroom.create({
      name: 'Class C',
      capacity: 30,
      resources: ['whiteboard'],
      school_id: schoolId,
    });

    const response = await request(app)
      .put(`/api/students/enroll`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        studentId,
        classroomId: newClassroom._id,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Student enrolled successfully');
    expect(response.body.student.classrooms).toContainEqual(newClassroom._id);
  });
});
