import request from "supertest";
import app from "../app.js";
import { connectTestDB, disconnectTestDB } from "./setup.js";
import User from "../Models/userSchema.js";


beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe("User Controller", () => {
  let token;
  let userId;

  test("should create a new user", async () => {
    const res = await request(app)
      .post("/api/user/signup")
      .send({ email: "test@example.com", password: "password123" });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User created successfully");
  });

  test("should login successfully", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({ email: "test@example.com", password: "password123" });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Logged in successfully!");
    
    token = res.headers["set-cookie"][0].split(";")[0].split("=")[1]; // extract JWT cookie
    const user = await User.findOne({ email: "test@example.com" });
    userId = user._id;
  });

  test("should set username", async () => {
    const res = await request(app)
      .post("/api/user/setusername")
      .set("Cookie", [`jwt=${token}`])
      .send({ username: "nafeur" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Username set successfully");
  });

  test("should check auth", async () => {
    const res = await request(app)
      .get("/api/user/auth")
      .set("Cookie", [`jwt=${token}`]);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toBeDefined();
  });

  test("should logout successfully", async () => {
    const res = await request(app)
      .post("/api/user/logout")
      .set("Cookie", [`jwt=${token}`]);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Logged out successfully");
  });

  test("should delete user", async () => {
    const res = await request(app)
      .delete(`/api/user/${userId}`)
      .set("Cookie", [`jwt=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User deleted successfully");
  });
});
