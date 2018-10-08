const fs = require("fs");
const bodyParser = require("body-parser");
const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const lodashId = require("lodash-id");
const url = require("url");

const server = jsonServer.create();
const router_condominium = jsonServer.router(
  "./database/condominium/entities.json"
);
const bizdb_condominium = JSON.parse(
  fs.readFileSync("./database/condominium/entities.json", "UTF-8")
);
const router_auth = jsonServer.router("./database/auth.json");
const authdb = JSON.parse(fs.readFileSync("./database/auth.json", "UTF-8"));

const user_schema = require("./schemas/auth/users");
const role_schema = require("./schemas/auth/roles");
const permission_schema = require("./schemas/auth/permissions");
const permission_assignment_schema = require("./schemas/auth/permission_assignment");

const company_schema = require("./schemas/entities/condominium/company");
const property_schema = require("./schemas/entities/condominium/property");
const unit_schema = require("./schemas/entities/condominium/unit");
const parkingspot_schema = require("./schemas/entities/condominium/parkingspot");
const person_schema = require("./schemas/entities/condominium/person");
const vehicle_schema = require("./schemas/entities/condominium/vehicle");
const note_schema = require("./schemas/entities/condominium/note");
const post_schema = require("./schemas/entities/condominium/post");

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(jsonServer.defaults());

const SECRET_KEY = "123456789";

const expiresIn = "1h";

_.mixin(lodashId);

// Create a token from a payload
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Verify the token
function verifyToken(token) {
  return jwt.verify(
    token,
    SECRET_KEY,
    (err, decode) => (decode !== undefined ? decode : err)
  );
}

// Check if the user exists in database
function isAuthenticated({ email, password }) {
  return (
    authdb.users.findIndex(
      user => user.email === email && user.password === password
    ) !== -1
  );
}

function findUserProfile(email) {
  var permissions = [];
  const user = _.find(authdb.users, u => u.email === email);
  const role = _.find(authdb.roles, r => r.id === user.roleId);
  const permission_assignment = _.filter(
    authdb.permission_assignment,
    a => a.roleId === user.roleId
  );
  permission_assignment.forEach(pa => {
    permissions.push(_.find(authdb.permissions, p => p.id === pa.permissionId));
  });
  const user_profile = {
    user: {
      username: user.username,
      display_name: user.display_name,
      email: user.email,
      user_enabled: user.enabled,
      role: role.name,
      role_enabled: role.enabled
    },
    permissions
  };

  return user_profile;
}

function isPermissionFound(token, permission) {
  const permission_found = _.find(
    token.permissions,
    p => p.code === permission
  );
  return typeof permission_found == "undefined" ? false : true;
}

function hasAuthority(resource, operation, user_profile) {
  const permission = resource + ":" + operation;
  const all_operations = resource + ":*";
  const superuser = "*:*";

  //console.log(permission);

  if (!isPermissionFound(user_profile, permission)) {
    if (!isPermissionFound(user_profile, all_operations)) {
      if (!isPermissionFound(user_profile, superuser)) {
        return false;
      }
    }
  }
  return true;
}

server.post("/api/v1/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (isAuthenticated({ email, password }) === false) {
    res
      .status(401)
      .json({ status: 401, message: "Error: Incorrect email or password" });
    return;
  }
  const user_profile = findUserProfile(email);
  const access_token = createToken(user_profile.user);
  res.status(200).json({ access_token });
});

server.get("/api/v1/auth/profile", (req, res) => {
  if (
    req.headers.authorization === undefined ||
    req.headers.authorization.split(" ")[0] !== "Bearer"
  ) {
    res.status(400).json({
      status: 400,
      message: "Error: Access token is missing or invalid"
    });
    return;
  }

  try {
    const decoded_token = verifyToken(req.headers.authorization.split(" ")[1]);

    const user_profile = findUserProfile(decoded_token.email);
    res
      .status(200)
      .json({ user: user_profile.user, permissions: user_profile.permissions });
  } catch (err) {
    res
      .status(401)
      .json({
        status: 401,
        message: "Error: Access token is revoked",
        error: err
      });
  }
});

server.use(/^(?!\/auth).*$/, (req, res, next) => {
  if (
    req.headers.authorization === undefined ||
    req.headers.authorization.split(" ")[0] !== "Bearer"
  ) {
    res.status(400).json({
      status: 400,
      message: "Error: Access token is missing or invalid"
    });
    return;
  }
  try {
    let resources = [];
    const decoded_token = verifyToken(req.headers.authorization.split(" ")[1]);
    const url_path = req._parsedUrl.path;
    const adr = `http://${req.headers.host}${url_path}`;

    let q = url.parse(adr, true);

    const auth_entities = Object.keys(authdb);
    let entities = auth_entities;
    const biz_entities_condominium = Object.keys(bizdb_condominium);
    entities = _.union(entities, biz_entities_condominium);

    const pathname_tokens = q.pathname.split("/");
    resources = _.intersection(entities, pathname_tokens);

    if (q.query._embed !== undefined) {
      resources.push(q.query._embed.toUpperCase());
    }

    if (q.query._expand !== undefined) {
      resources.push(q.query._expand.toUpperCase());
    }

    const user_profile = findUserProfile(decoded_token.email);

    let operation;
    switch (req.method) {
      case "GET":
        operation = "READ";
        break;
      case "POST":
        operation = "CREATE";
        break;
      case "PUT":
        operation = "UPDATE";
        break;
      case "PATCH":
        operation = "UPDATE";
        break;
      case "DELETE":
        operation = "DELETE";
        break;
      default:
        operation = "UNKNOWN";
    }

    resources.forEach(r => {
      if (!hasAuthority(r.toUpperCase(), operation, user_profile)) {
        res.status(404).json({
          status: 404,
          message: `You don't have permission (${r.toUpperCase()}:${operation})`
        });
        return;
      }
    });

    let error_messages = [];

    let validation_result = { error: null, value: null };
    if (req.method === "POST" || req.method === "PUT") {
      switch (resources[0]) {
        case "users":
          validation_result = user_schema.validate(req.body);
          if (validation_result.error === null) {
            const role = _.find(authdb.roles, r => r.id === req.body.roleId);
            if (role === undefined) {
              error_messages.push(
                `Role id "${req.body.roleId}" doesn't exist.`
              );
              res.status(400).json({
                status: 400,
                message: error_messages
              });
              return;
            }
          }
          break;

        case "roles":
          validation_result = role_schema.validate(req.body);
          break;

        case "permissions":
          validation_result = permission_schema.validate(req.body);
          break;

        case "permission_assignment":
          validation_result = permission_assignment_schema.validate(req.body);
          if (validation_result.error === null) {
            const role = _.find(authdb.roles, r => r.id === req.body.roleId);
            if (role === undefined) {
              error_messages.push(
                `Role id "${req.body.roleId}" doesn't exist.`
              );
              res.status(400).json({
                status: 400,
                message: error_messages
              });
              return;
            }
            const permission = _.find(
              authdb.permissions,
              p => p.id === req.body.permissionId
            );
            if (permission === undefined) {
              error_messages.push(
                `Permission id "${req.body.permissionId}" doesn't exist.`
              );
              res.status(400).json({
                status: 400,
                message: error_messages
              });
              return;
            }
          }
          break;

        case "company":
          validation_result = company_schema.validate(req.body);
          break;
        case "property":
          validation_result = property_schema.validate(req.body);
          break;
        case "unit":
          validation_result = unit_schema.validate(req.body);
          break;
        case "parkingspot":
          validation_result = parkingspot_schema.validate(req.body);
          break;
        case "person":
          validation_result = person_schema.validate(req.body);
          break;
        case "vehicle":
          validation_result = vehicle_schema.validate(req.body);
          break;
        case "note":
          validation_result = note_schema.validate(req.body);
          break;
        case "post":
          validation_result = post_schema.validate(req.body);
          break;
      }
    }

    if (validation_result.error !== null) {
      validation_result.error.details.forEach(err => {
        error_messages.push(err.message);
      });
      console.log(error_messages);

      res.status(400).json({
        status: 400,
        message: error_messages
      });
      return;
    }

    next();
  } catch (err) {
    res
      .status(401)
      .json({
        status: 401,
        message: "Error: Access token is revoked",
        error: err
      });
  }
});

server.get("/api/v1/auth/roles/:roleId/permissions", (req, res) => {
  let permissions = [];
  const permission_assignment = _.filter(
    authdb.permission_assignment,
    a => a.roleId.toString() === req.params.roleId.toString()
  );
  permission_assignment.forEach(pa => {
    permissions.push(_.find(authdb.permissions, p => p.id === pa.permissionId));
  });
  res.status(200).json({ permissions });
});

server.use("/api/v1/auth", router_auth);
server.use("/api/v1/condominium", router_condominium);

server.listen(3000, () => {
  console.log("Run Auth API Server (port: 3000)");
});
