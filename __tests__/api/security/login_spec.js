const api = require("frisby");

const url = "http://localhost:3000/api/v1";

it("debe obtener token en el login con usuario y password válidos", () => {
  return api
    .post(url + "/auth/login", {
      email: "efuentes@softtek.com",
      password: "edgar"
    })
    .expect("status", 200);
});

it("debe marcar error en el login con usuario válido y password inválido", () => {
  return api
    .post(url + "/auth/login", {
      email: "efuentes@softtek.com",
      password: "password"
    })
    .expect("status", 401);
});

it("debe marcar error en el login con usuario inexistente", () => {
  return api
    .post(url + "/auth/login", {
      email: "juan.perez@mail.com",
      password: "password"
    })
    .expect("status", 401);
});
