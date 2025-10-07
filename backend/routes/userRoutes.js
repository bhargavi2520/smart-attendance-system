const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// Route for getting all users and creating a new user
router
  .route("/")
  .get(protect, authorize("ADMIN"), getAllUsers)
  .post(protect, authorize("ADMIN"), createUser);

// Route for updating and deleting a specific user
router
  .route("/:id")
  .put(protect, authorize("ADMIN"), updateUser)
  .delete(protect, authorize("ADMIN"), deleteUser);

module.exports = router;
