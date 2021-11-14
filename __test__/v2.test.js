const scenarios = {
  user: {
    username: "user",
    password: "test",
    res: {
      get: {
        status: 200,
      },
    },
  },
};

const { db } = require("../src/models/index");
const { server } = require("../src/server");
const supertest = require("supertest");
const request = supertest(server);
describe("makePoniesPink", () => {
  let token = "";
  Object.keys(scenarios).forEach((role) => {
    beforeAll(async () => {
      await db.dropAllSchemas();
      await db.sync({ force: true });
      const res = await request.post("/signup").send({
        username: scenarios[role].username,
        password: scenarios[role].password,
        role: role,
      });

      token = res.body.token;
    });

    afterAll(async () => {
      await db.dropAllSchemas();
    });

    describe(role, () => {
      test(`should create a new fruit for ${role}`, async () => {
        const res = await request
          .post("/api/v2/food")
          .set("Authorization", `Bearer ${token}`)
          .send({
            name: "cocomilon",
            calories: 1,
            type: "fruit",
          });
        let a;
        let b;
        let c;
        if (scenarios[role].res["post"]) {
          const { name, calories, type } = res.body;
          a = { name, calories, type };
          b = {
            name: "cocomilon",
            calories: 1,
            type: "fruit",
          };
          c = 201;
        } else {
          a = "Access Denied";
          b = "Access Denied";
          c = 500;
        }
        expect(res.status).toBe(c);
        expect(a).toStrictEqual(b);
      });

      test("should update a fruit " + role, async () => {
        const res = await request
          .put("/api/v2/food/1")
          .set("Authorization", `Bearer ${token}`)
          .send({
            name: "updated",
            calories: 1,
            type: "fruit",
          });
        let a;
        let b;
        let c;
        if (scenarios[role].res["update"]) {
          const { name, calories, type } = res.body;
          a = { name, calories, type };
          b = {
            id: 1,
            name: "updated",
            calories: 1,
            type: "fruit",
          };
          c = 200;
        } else {
          a = "Access Denied";
          b = "Access Denied";
          c = 500;
        }
        expect(res.status).toBe(c);
        expect(a).toStrictEqual(b);
      });

      test("should delete the second id=1 fruit " + role, async () => {
        const res = await request
          .delete("/api/v2/food/1")
          .set("Authorization", `Bearer ${token}`);
        let a;
        let b;
        let c;
        if (scenarios[role].res["delete"]) {
          a = res.body;
          b = "deleted successfully";
          c = 204;
        } else {
          a = "Access Denied";
          b = "Access Denied";
          c = 500;
        }

        expect(res.status).toBe(c);

        expect(res.status).toBe(c);
        expect(a).toBe(b);
      });
    });
  });
});
