const express = require("express");
const router = express.Router();
const schoolController = require("../controllers/schoolController");
const authenticateJWT = require("../config/auth");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/",
  authenticateJWT,
  roleMiddleware(["superadmin"]),
  schoolController.getAllSchools
);
router.post(
  "/",
  authenticateJWT,
  roleMiddleware(["superadmin"]),
  schoolController.createSchool
);
router.put(
  "/:id",
  authenticateJWT,
  roleMiddleware(["superadmin"]),
  schoolController.updateSchoolProfile
);
router.delete(
  "/:id",
  authenticateJWT,
  roleMiddleware(["superadmin"]),
  schoolController.deleteSchool
);
module.exports = router;
