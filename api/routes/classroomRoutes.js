const express = require("express");
const router = express.Router();
const classroomController = require("../controllers/classroomController");
const authenticateJWT = require("../config/auth");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/",
  authenticateJWT,
  roleMiddleware(["school_admin", "superadmin"]),
  classroomController.getAllClassrooms
);

router.post(
  "/",
  authenticateJWT,
  roleMiddleware(["school_admin", "superadmin"]),
  classroomController.createClassroom
);

router.put(
  "/:id",
  authenticateJWT,
  roleMiddleware(["school_admin", "superadmin"]),
  classroomController.updateClassroom
);

router.delete(
  "/:id",
  authenticateJWT,
  roleMiddleware(["school_admin", "superadmin"]),
  classroomController.deleteClassroom
);

module.exports = router;
