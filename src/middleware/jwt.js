const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config/config");
const userModel = require("../model/user.model");

const jwtConfig = {
  sign(payload) {
    const token = jwt.sign(payload, JWT_SECRET_KEY);
    return token;
  },
  verifyUser(req, res, next) {
    const authHeader = req.headers.authorization;

    try {
      if (authHeader) {
        const [bearer, token] = authHeader.split(" ");
        jwt.verify(token, JWT_SECRET_KEY, function (err, decoded) {
          if (err) {
            res.status(401).json({ message: "You are not authorized" });
          } else {
            req.user = decoded;
            // console.log(req.user)
            next();
          }
        });
      } else {
        res.status(401).json({ message: "You are not authorized" });
      }
    } catch (error) {
      // console.log(err);
      res.status(520).send(error);
    }
  },
  async authGuard(req, res) {
    const authHeader = req.headers.authorization;

    try {
      if (authHeader) {
        const [bearer, token] = authHeader.split(" ");

        jwt.verify(token, JWT_SECRET_KEY, async function (err, decoded) {
          const user = await userModel.findOne({ email: decoded.user.email });
          if (err) {
            throw new Error("You aresdsds not authorized");
          } else {
            res.status(200).json({
              message: "User Authorized",
              role: user.role,
              status: user.status,
              name: user.name,
            });
          }
        });
      } else {
        throw new Error("Something Went Wrong");
      }
    } catch (error) {
      res.status(520).send(error.message);
    }
  },
  async verifyAdmin(req, res, next) {
    const authHeader = req.headers.authorization;

    try {
      if (authHeader) {
        const [bearer, token] = authHeader.split(" ");
        const decoded = await userModel.find({ email: token.user.email });
        jwt.verify(token, JWT_SECRET_KEY, function (err, decoded) {
          // console.log(decoded.user)
          if (err) {
            res.status(401).json({ message: "You are not authorized" });
          } else if (decoded.user.role !== "admin") {
            console.log(decoded.newUser.role);
            res.status(401).json({ message: "You are not authorized" });
          } else {
            req.user = decoded;
            console.log("authorized");
            next();
          }
        });
      } else {
        res.status(401).json({ message: "You are not authorized" });
      }
    } catch (error) {
      res.status(520).send(error);
    }
  },
};

module.exports = jwtConfig;
