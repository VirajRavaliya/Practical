const jwt = require("jsonwebtoken");
const _ = require("lodash");
require("dotenv").config();
const app_secret = process.env.APP_SECRET;
const db = require("../models");
const { createLogFile } = require("../utils/createLog");

const userModel = db.user;

module.exports = async (req, res, next) => {
  try {
    const Authorization =
      req.headers["authorization"]?.split("Bearer ")[1] || null;

    if (Authorization !== null) {
      const secretKey = app_secret;

      await jwt.verify(Authorization, secretKey, async function (err, decoded) {
        if (err !== null) {
          return res.json({
            status: false,
            message: err.message,
            code: 402,
            module: "user",
          });
        }
        if (decoded) {

          const findUser = await userModel.findOne({
            where: { id: decoded?.user_id },
            raw: true,
          });
          req.user = findUser;

          if (!findUser) {
            return res.json({
              status: false,
              message: "User not exist.",
              code: 402,
            });
          }
          next();
        } else {
          return res.json({
            status: false,
            message: "You are not authorized.",
            code: 402,
          });
        }
      });
    } else {
      return res.json({
        status: false,
        message: "Token not found.",
        code: 402,
      });
    }
  } catch (error) {
    createLogFile("auth", error, error?.stack, "auth", "middleware");
    return res.json({ status: false, message: error.message, code: 500 });
  }
};
