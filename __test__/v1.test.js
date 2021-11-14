const { db } = require("../src/models/index");
const { server } = require("../src/server");
const supertest = require("supertest");
const request = supertest(server);

describe("makePoniesPink", () => {
  beforeAll(async () => {
    await db.sync();
  });
  afterAll(async () => {
    await db.drop();
  });

  test("should create a new fruit", async () => {
    const res = await request.post("/api/v1/food").send({
      name: "cocomilon",
      calories: 1,
      type: "fruit",
    });
    await request.post("/api/v1/food").send({
      name: "cocomilon2",
      calories: 2,
      type: "fruit",
    });
    const { id, name, calories, type } = JSON.parse(res.text);
    expect(res.status).toBe(201);
    expect({ id, name, calories, type }).toStrictEqual({
      id: 1,
      name: "cocomilon",
      calories: 1,
      type: "fruit",
    });
  });

  test("should get the fruit", async () => {
    const res = await request.get("/api/v1/food");
    const { id, name, calories, type } = JSON.parse(res.text)[0];
    console.log(res.text);
    expect(res.status).toBe(200);
    expect({ id, name, calories, type }).toStrictEqual({
      id: 1,
      name: "cocomilon",
      calories: 1,
      type: "fruit",
    });
  });

  test("should get the second id=2 fruit", async () => {
    const res = await request.get("/api/v1/food/2");

    console.log(res.text);
    const { id, name, calories, type } = JSON.parse(res.text);
    expect(res.status).toBe(200);
    expect({ id, name, calories, type }).toStrictEqual({
      id: 2,
      name: "cocomilon2",
      calories: 2,
      type: "fruit",
    });
  });

  test("should update a fruit", async () => {
    const res = await request.put("/api/v1/food/1").send({
      name: "updated",
      calories: 1,
      type: "fruit",
    });
    console.log(res.text);

    const { id, name, calories, type } = res.body;
    expect(res.status).toBe(200);
    expect({ id, name, calories, type }).toStrictEqual({
      id: 1,
      name: "updated",
      calories: 1,
      type: "fruit",
    });
  });

  test("should delete the second id=2 fruit", async () => {
    const res = await request.delete("/api/v1/food/2");

    expect(res.status).toBe(200);
  });
});
