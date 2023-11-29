const express = require("express");
const { createUser, login, forgotPassword, resetPassword } = require("../controller/auth.controller");
const router = express.Router();


router.post("/signup", createUser);
router.post("/login", login);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);









module.exports = router;