const { check, validationResult } = require("express-validator");

exports.signUpVAL = [
  check("password").trim().not().isEmpty().withMessage('Password is required.'),
  check("username").trim().not().isEmpty().withMessage('username is required.'),
];

exports.Validation = (req, res, next) => {
  let error = [];
  const result = validationResult(req).array();
  if (!result.length) return next();

  result.map(async (res, index) => {
    error.push(res.msg);
  });

  return res.json({
    status: false,
    message: error.join(", "),
    data: {},
    code: 200,
  });
};
