const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const APP_SECRET = process.env.APP_SECRET;

module.exports.generateSalt = async () => {
  return bcrypt.genSalt();
};

module.exports.generateHashPassword = async (password) => {
  const salt = await this.generateSalt();
  return bcrypt.hashSync(password, salt);
};

module.exports.comparePassword = async (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
};

module.exports.generateToken = async (data) => {
  const token = jwt.sign(data, APP_SECRET, { expiresIn: "3650d" });
  return token;
};


module.exports.Pagination = async (totalCount, currentPage, pageSize) => {
  let totalPage = Math.ceil(totalCount / pageSize);
  let isMore = totalPage <= currentPage ? false : true;

  let pagination = {
    totalCount: totalCount,
    defaultPageSize: pageSize,
    totalPage: totalPage,
    currentPage: currentPage,
    isMore: isMore,
  };
  return pagination;
};