const request = require("supertest");
const app = require("./app");
const User = require("./models/User");

const userData = {
  email: "cosmina@yahoo.com",
  password: "cosmina1234",
  subscription: "starter",
};

describe("POST /login - user login", () => {
  test("200 Success login - should return token and user object", (done) => {
    request(app)
      .post("/users/login")
      .send(userData)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(200);

        expect(body).toHaveProperty("token", expect.any(String));

        expect(body).toHaveProperty("user");
        expect(body.user).toHaveProperty("email", expect.any(String));
        expect(body.user).toHaveProperty("subscription", expect.any(String));

        expect(body.user.email).toBe(userData.email);
        expect(body.user.subscription).toBe(userData.subscription);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
