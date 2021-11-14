const { db } = require("../src/models/index");
const { server } = require("../src/server");
const supertest = require("supertest");
const request = supertest(server);

describe("makePoniesPink", () => {
  beforeAll(async () => {
    await db.drop();
    await db.sync();
  });
  afterAll(async () => {
    await db.drop();
  });
  test("sing up a user", async () => {
    const res = await request.post("/signup").send({
      username: "test",
      password: "test",
      role: "user",
    });
    expect(res.status).toBe(201);
  });
  test("sing in a user", async () => {
    const res = await request
      .post("/signin")
      .set("Authorization", "Basic dGVzdDp0ZXN0");
    expect(res.status).toBe(200);
  });
  test("throw error for invalid Login", async () => {
    const res = await request
      .post("/signin")
      .set("Authorization", "Basic dGVzdDo=");
    expect(res.status).toBe(403);
  });
});
