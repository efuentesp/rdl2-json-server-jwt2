const api = require("frisby");

const url = "http://localhost:3000/api/v1";

it("debe obtener obtener perfil del usuario con token válido", () => {
  return api
    .post(url + "/auth/login", {
      email: "efuentes@softtek.com",
      password: "edgar"
    })
    .expect("status", 200)
    .then(res => {
      const { access_token } = res.json;
      return api.get(url + "/auth/profile").expect("status", 200);
    });
});
