// __tests__/notesController.test.js
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import User from "../Models/userSchema.js";
import Note from "../Models/notesSchema.js";
import { connectTestDB, disconnectTestDB } from "./setup.js";

let testUser;
let token;

beforeAll(async () => {
  await connectTestDB();

  // Create a test user
  testUser = await User.create({ email: "test@test.com", password: "123456" });

  // Generate JWT token
  token = jwt.sign(
    { userId: testUser._id, email: testUser.email },
    process.env.JWT_SECRET || "test_secret",
    { expiresIn: "1h" }
  );
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await Note.deleteMany({});
});

describe("Note Controller", () => {
  it("should create a new note", async () => {
    const res = await request(app)
      .post("/api/note/newnote")
      .set("Cookie", [`jwt=${token}`])
      .send({ title: "Test Note", content: "This is a test note." });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Note created successfully");
    expect(res.body.note).toHaveProperty("_id");
  });

  it("should get all notes for the user", async () => {
    const note = await Note.create({ title: "Note1", content: "Hello", user: testUser._id });

    const res = await request(app)
      .get("/api/note/allnotes")
      .set("Cookie", [`jwt=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  it("should update a note", async () => {
    const note = await Note.create({ title: "Old Note", content: "Old content", user: testUser._id });

    const res = await request(app)
      .put(`/api/note/${note._id}`)
      .set("Cookie", [`jwt=${token}`])
      .send({ title: "Updated Note", content: "Updated content" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Note updated successfully");
    expect(res.body.note.title).toBe("Updated Note");
  });

  it("should delete a note", async () => {
    const note = await Note.create({ title: "Delete Note", content: "Delete this", user: testUser._id });

    const res = await request(app)
      .delete(`/api/note/${note._id}`)
      .set("Cookie", [`jwt=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Note deleted successfully");
  });

  it("should return 404 when getting notes if none exist", async () => {
    const res = await request(app)
      .get("/api/note/allnotes")
      .set("Cookie", [`jwt=${token}`]);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("No notes found for this user");
  });
});
