const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../App");

let adminToken;
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
  const user = { _id: "67813b1c79cd5de2fb26bf73", role: "superadmin" };
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
});

describe("POST /schools", () => {
  it("should create a school (only superadmin can create)", async () => {
    const response = await request(app)
      .post("/api/schools")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Test School",
        address: "123 Test St",
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Test School");
    expect(response.body.address).toBe("123 Test St");
  });

  it("should deny access for non-superadmin", async () => {
    const invalidToken = jwt.sign(
      { userId: "67813b8679cd5de2fb26bf75", role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const response = await request(app)
      .post("/api/schools")
      .set("Authorization", `Bearer ${invalidToken}`)
      .send({
        name: "Another School",
        address: "456 Another St",
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "Forbidden: You do not have access to this resource"
    );
  });

  it("should return error if no token is provided", async () => {
    const response = await request(app).post("/api/schools").send({
      name: "No Token School",
      address: "789 No Token St",
    });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("No token provided");
  });
});
