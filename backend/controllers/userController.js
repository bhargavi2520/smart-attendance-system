const db = require("../models");
const { Op, sequelize } = require("sequelize");

// @desc    Get all users (with optional role filter)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  const { role } = req.query;
  try {
    let options = {
      include: [
        {
          model: db.Role,
          as: "roles",
          attributes: ["name"],
          through: { attributes: [] },
        },
        { model: db.StudentProfile, as: "studentProfile", include: ["class"] },
        {
          model: db.FacultyProfile,
          as: "facultyProfile",
          include: ["department"],
        },
      ],
      attributes: { exclude: ["password"] },
    };

    if (role) {
      options.include[0].where = { name: role.toUpperCase() };
    }

    const users = await db.User.findAll(options);
    res.json({ users });
  } catch (error) {
    console.error("Failed to get users:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    rollNumber,
    classId,
    department,
    designation,
  } = req.body;

  const t = await db.sequelize.transaction();

  try {
    const user = await db.User.create(
      { name, email, password },
      { transaction: t }
    );

    const userRole = await db.Role.findOne(
      { where: { name: role } },
      { transaction: t }
    );
    if (!userRole) {
      await t.rollback();
      return res.status(400).json({ message: `Role '${role}' not found.` });
    }

    await user.addRole(userRole, { transaction: t });

    if (role === "STUDENT") {
      if (!rollNumber || !classId) {
        await t.rollback();
        return res
          .status(400)
          .json({
            message: "Roll number and Class are required for students.",
          });
      }
      await db.StudentProfile.create(
        { userId: user.id, rollNumber, classId },
        { transaction: t }
      );
    } else {
      if (!department || !designation) {
        await t.rollback();
        return res
          .status(400)
          .json({
            message: "Department and Designation are required for staff.",
          });
      }

      const dept = await db.Department.findOne(
        { where: { name: department } },
        { transaction: t }
      );
      if (!dept) {
        await t.rollback();
        return res
          .status(400)
          .json({ message: `Department '${department}' not found.` });
      }

      await db.FacultyProfile.create(
        {
          userId: user.id,
          departmentId: dept.id,
          designation,
        },
        { transaction: t }
      );
    }

    await t.commit();

    const newUser = await db.User.findByPk(user.id, {
      include: [
        {
          model: db.Role,
          as: "roles",
          attributes: ["name"],
          through: { attributes: [] },
        },
        { model: db.StudentProfile, as: "studentProfile" },
        {
          model: db.FacultyProfile,
          as: "facultyProfile",
          include: ["department"],
        },
      ],
      attributes: { exclude: ["password"] },
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    await t.rollback();
    console.error("Failed to create user:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  const { name, email, password, role, rollNumber, department, designation } =
    req.body;
  const t = await db.sequelize.transaction();

  try {
    const user = await db.User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      user.password = password; // Hook will re-hash
    }
    await user.save({ transaction: t });

    // Handle role update
    if (role) {
      const newRole = await db.Role.findOne({ where: { name: role } });
      if (newRole) {
        await user.setRoles([newRole], { transaction: t });
      }
    }

    // ... logic to update profiles based on new role ...

    await t.commit();
    res.json({ message: "User updated successfully" });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const user = await db.User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // This will cascade and delete profiles due to foreign key constraints
    await user.destroy({ transaction: t });
    await t.commit();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
