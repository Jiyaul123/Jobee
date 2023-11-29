const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const { getUserData, updateUserData, uploadFile } = require("../controller/user.controller");
const upload = require("../middleware/upload.middleware");
const router = express.Router();


router.get("/details", authMiddleware, getUserData);
router.put("/update", authMiddleware, updateUserData);




module.exports = router;