const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const authenticateJWT = require("../config/auth");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  authenticateJWT,
  roleMiddleware(["school_admin", "superadmin"]),
  studentController.createStudent
);
router.post(
  "/transfer",
  authenticateJWT,
  roleMiddleware(["school_admin", "superadmin"]),
  studentController.transferStudent
);
router.post(
  "/enroll",
  authenticateJWT,
  roleMiddleware(["school_admin", "superadmin"]),
  studentController.enrollStudent
);
module.exports = router;
