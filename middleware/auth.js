const JWT = require("jsonwebtoken");
const authConfig = require("../config/config");
const TokenBlacklist = require("../blacklist-token/blacklist.model");

// this permissions came from routes/users:
// "route.get("/", authMiddleware(["ADMIN"]), userController.getUsers);""
const authMiddleware = (permissions) => {
  return async function (req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      console.log(authHeader);
    } catch (error) {}
  };
};

const _checkUserToken = async (userToken) => {
  // check if the userToken exists
  if (!userToken) {
    throw new Error("Token not informed.");
  }
  // check if the userToken has the correct format
  const parts = userToken.split("");
  if (!parts.length === 2) throw Error("Token error!");
  const [scheme, token] = parts;
  if (!/^bearer$/i.test(scheme)) {
    throw Error("Invalid token format!");
  }
  // decode token
  let decoded = await JWT.verify(token, authConfig.secret);
  if (!decoded.params.id) {
    throw Error("Invalid token!");
  } else {
    const idDecoded = decoded.params.id;
    console.log(idDecoded);

    const _verifyUserBlacklist = async (token) => {
      const verify = await TokenBlacklist.findOne({ token: token });
      return verify;
    };
    if (await _verifyUserBlacklist(userToken)) {
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

const _getUserPermissions = async (user) => {
  const userPermissions = [];
  // don't get this part:
  if (user["__t"] && user["__t"] == "ADMIN") {
    userPermissions.push("ADMIN");
  }
  return userPermissions;
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
