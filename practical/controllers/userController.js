require("dotenv").config();
const db = require("../models/index");
const _ = require("lodash");
const { Op } = require("sequelize");
const {
  generateHashPassword,
  generateToken,
  Pagination,
  comparePassword,
} = require("../utils/commonFun");
const { createLogFile } = require("../utils/createLog");


const userModel = db.user;

module.exports.signIn = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { username, password, email } = req?.body;

    // For SignIn
    if (_.isUndefined(email)) {
      const findUser = await userModel.findOne({
        where: {
          userName: username,
        },
        attributes: ["password", "id"],
        raw: true,
      });
      if (!findUser) {
        await t.rollback();
        return res.json({
          status: false,
          message: "User not found.",
          code: 200,
        });
      }

      //Check Password
      const checkPassword = await comparePassword(password, findUser?.password);
      if (!checkPassword) {
        await t.rollback();
        return res.json({
          status: false,
          message: "Invalid password.",
          code: 200,
        });
      }

      const token = await generateToken({ user_id: findUser?.id });

      return res.json({
        status: true,
        message: "You have sign-in successfully.",
        code: 200,
        data: token,
      });
    }

    // For SignUp

    // Check Email validation
    const isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    if (!isEmail) {
      await t.rollback();
      return res.json({
        status: false,
        message: "Please provide valid email.",
        code: 200,
      });
    }

    const findUser = await userModel.findOne({ where: { email: email } });
    if (findUser) {
      await t.rollback();
      return res.json({
        status: false,
        message: "User already exits. Please sign in.",
        code: 200,
      });
    }

    let HashPassword = await generateHashPassword(password);

    const userData = {
      userName: username,
      email: email,
      password: HashPassword,
    };

    await userModel
      .create(userData, { transaction: t })
      .then(async () => {
        await t.commit();
        return res.json({
          stauts: true,
          message: "User registered successfully.",
          code: 200,
        });
      })
      .catch(async (err) => {
        await t.rollback();
        return res.json({
          stauts: false,
          message: err?.message,
          code: 500,
        });
      });
  } catch (error) {
    createLogFile(
      "signIn",
      error,
      error?.stack,
      "userController",
      "controllers"
    );
    await t.rollback();
    return res.json({
      status: false,
      message: error?.message,
      code: 500,
    });
  }
};

module.exports.userList = async (req, res) => {
  try {
    const { page } = req?.query;
    const { email, role, userName, createdAt } = req?.user;

    if (role == "user") {
      const data = { email, username: userName, createdAt };

      return res.json({
        status: true,
        message: "User data found successfully.",
        code: 200,
        data: data,
      });
    }

    // For Admin
    if (!page) {
      return res.json({
        status: false,
        message: "Page number is required.",
        code: 200,
      });
    }
    let limit = 10;
    let limits = limit ? parseInt(limit) : 25;
    const skip = page ? (page - 1) * limits : 0;

    await userModel
      .findAndCountAll({
        where: { [Op.not]: { role: role } },
        attributes: ["id", "userName", "email", "createdAt"],
        limit: limit,
        offset: skip,
        raw: true,
      })
      .then(async (data) => {
        let pagination = await Pagination(data["count"], page, limit);

        return res.json({
          status: true,
          message: "User data found successfully.",
          code: 200,
          data: { userData: data?.rows, pagination },
        });
      })
      .catch((err) => {
        return res.json({
          status: false,
          message: err?.message,
          code: 500,
        });
      });
  } catch (error) {
    createLogFile(
      "userList",
      error,
      error?.stack,
      "userController",
      "controllers"
    );
    return res.json({
      status: false,
      message: error?.message,
      code: 500,
    });
  }
};
