const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../App");
const Classroom = require("../models/classroom");

let mongoServer;
jest.setTimeout(20000);
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
  // Mock Admin user and create token
  const user = { _id: "67813b1c79cd5de2fb26bf73", role: "school_admin" };
  adminToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
});

afterAll(async () => {
  await mongoose.connection.close();
  //await mongoServer.stop();
});

describe("POST /classrooms", () => {
  it("should create a classroom", async () => {
    const classroomData = {
      name: "Math 101",
      capacity: 30,
      resources: ["Projector", "Whiteboard"],
      school_id: "67813bb9428ee0e747fe717e",
    };

    const response = await request(app)
      .post("/api/classrooms")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(classroomData);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(classroomData.name);
    expect(response.body.capacity).toBe(classroomData.capacity);
    expect(response.body.resources).toEqual(classroomData.resources);
    expect(response.body.school_id).toBe(classroomData.school_id);
  });

  it("should return an error if required fields are missing", async () => {
    const response = await request(app)
      .post("/api/classrooms")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        school_id: '67813bb9428ee0e747fe717e',
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error creating classroom");
  });
});

describe("PUT /classrooms/:id", () => {
  let classroom;

  beforeAll(async () => {
    classroom = new Classroom({
      name: "Physics 101",
      capacity: 25,
      resources: ["Projector"],
      school_id: "67813bb9428ee0e747fe717e",
    });
    await classroom.save();
  });

  it("should update the classroom", async () => {
    const updatedData = {
      name: "Physics 102",
      capacity: 30,
      resources: ["Projector", "Lab Equipment"],
    };

    const response = await request(app)
      .put(`/api/classrooms/6781451ebb6c7c0e2fca72d9`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedData.name);
    expect(response.body.capacity).toBe(updatedData.capacity);
    expect(response.body.resources).toEqual(updatedData.resources);
  });
  it("should get 404 not found", async () => {
    const updatedData = {
      name: "Physics 102",
      capacity: 30,
      resources: ["Projector", "Lab Equipment"],
    };

    const response = await request(app)
      .put(`/api/classrooms/6781451ebb66d7ce2fca72d9`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(updatedData);

    expect(response.status).toBe(404);
  });

  it("should return 403 if classroom is not found", async () => {
    const response = await request(app)
      .put("/api/classrooms/678101832f6ec23fa7c9880")
      .send({ name: "Nonexistent Classroom" });

    expect(response.status).toBe(403);
  });
});

