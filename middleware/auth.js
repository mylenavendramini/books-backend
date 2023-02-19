const JWT = require("jsonwebtoken");
const authConfig = require("../config/config");
const TokenBlacklist = require("../blacklist-token/blacklist.model");
const User = require("../model/user.model");

// this permissions came from routes/users:
// "route.get("/", authMiddleware(["ADMIN"]), userController.getUsers);""
const authMiddleware = (permissions) => {
  return async function (req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      console.log(authHeader);
      const _userId = await _getUserId(authHeader);
      const user = await User.findOne({ _id: _userId });
      console.log(user);
      // verificar se userPermissions.[permissions] esta na lista de permissoes da rota. se sim, next, se nao, status (400) e falar que o usuario nao tem permissao
      let hasPermission = false;
      permissions.forEach((permission) => {
        if (user.permissions === permission) {
          hasPermission = true;
        }
      });
      if (hasPermission) {
        return next();
      } else {
        return res
          .status(400)
          .send({ message: "User doesn't have the permission." });
      }

      // novos desafios profissionais
    } catch (error) {
      return res.status(400).send({ error: error.message });
    }
  };
};

const _checkUserToken = async (token) => {
  // check if the userToken exists
  if (!token) {
    throw new Error("Token not informed.");
  }

  // decode token
  let decoded = await JWT.verify(token, authConfig.secret);
  console.log("decoded" + decoded);
  if (!decoded.params.id) {
    throw Error("Invalid token!");
  } else {
    const idDecoded = decoded.params.id;
    console.log(idDecoded);

    const _verifyUserBlacklist = async (token) => {
      // if it found theres a user that used the token and did logout

      return await TokenBlacklist.findOne({ token: token });
    };
    if (await _verifyUserBlacklist(token)) {
      throw Error("Sorry, your session has expired.");
    }
    return idDecoded;
  }
};

const _getUserId = async (authHeader) => {
  // check if the authHeader exists
  if (!authHeader) {
    throw new Error("Token not informed.");
  }
  // check if the authHeader has the correct format
  const parts = authHeader.split(" ");
  if (!parts.length === 2) throw Error("Token werror!");
  const [scheme, token] = parts;
  if (!/^bearer$/i.test(scheme)) {
    throw Error("Invalid token format.");
  }
  console.log(token);
  // check if the user id token pass the _checkUserToken?
  return await _checkUserToken(token);
};

const _checkIfUserHavePermission = async (
  userPermissions,
  routerPermissions
) => {
  let havePermission = false;
  // routerPermissions is the "permissions" passed in authMiddleware (that cames from router/users = "ADMIN")
  const routerPermissionLength = routerPermissions.length;
  let index = 0;
  // index < routerPermissionLength is the same as saying routerPermissionLength is bigger than 0 (which means that there is permission "ADMIN")
  while (!havePermission && index < routerPermissionLength) {
    const permission = routerPermissions[index];
    // this userPermissions is array that came from calling "_getUserPermissions(user)" as a parameter of _checkIfUserHavePermission(userPermissions, _) inside of authMiddleware() and the "user" parameter is User.findOne({ _id: _userId });
    havePermission = userPermissions.indexOf(permission) >= 0;
    index++;
  }
};

module.exports = authMiddleware;
