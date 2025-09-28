const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// All routes in this file are protected and restricted to PRINCIPAL role
router.use(protect, authorize("ADMIN"));

router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").put(updateUser).delete(deleteUser);

module.exports = router;
