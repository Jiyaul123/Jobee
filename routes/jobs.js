const express = require("express");
const router = express.Router();
const { getJobs, newJob, updateJob, deleteJob, getJobById, applyJob, getJobsByUser, getJobPublished, deleteUserData } = require("../controller/jobs.controller");
const { authMiddleware, authorizedRole } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");



// router.route("/jobs").get(getJobs);
router.get("/jobs", authMiddleware, getJobs);
router.get("/job/:jobId", authMiddleware, getJobById);
router.get("/job/user/get", authMiddleware, authorizedRole("User"), getJobsByUser)
router.get("/job/published", authMiddleware, authorizedRole("Employer"), getJobPublished)
router.post("/job/new", authMiddleware, authorizedRole("Employer", "Admin"), newJob);
router.put("/job/:jobId/apply", authMiddleware, authorizedRole("User"), upload.single("file"), applyJob);
router.put("/job/update/:jobId", authMiddleware, updateJob);
router.delete("/job/delete/:jobId", authMiddleware, deleteJob);
router.delete("/job/deleteUserData", authMiddleware, authorizedRole("User", "Employer"), deleteUserData);









module.exports = router;