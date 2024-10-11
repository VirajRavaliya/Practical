const router = require("express").Router();
const userAuth = require("../middlewares/auth");
const userController = require("../controllers/userController");

const { signUpVAL, Validation } = require("../middlewares/validations/user");

router.post("/auth/register", signUpVAL, Validation, userController.signIn);
router.get("/users", userAuth, userController.userList);

module.exports = router;
