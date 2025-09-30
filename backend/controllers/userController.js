const db = require("../models");
const { Op } = require("sequelize");
const User = db.User;
const bcrypt = require("bcryptjs");

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      include: [
        {
          model: db.Role,
          as: "roles",
          attributes: ["name"],
          through: { attributes: [] }, // Don't include the join table attributes
        },
        {
          model: db.StudentProfile,
          as: "studentProfile",
        },
        {
          model: db.FacultyProfile,
          as: "facultyProfile",
        },
      ],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Create a user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  // roles should be an array of role names e.g. ['student'] or ['faculty', 'hod']
  const { name, email, password, roles, rollNumber, department } = req.body;

  const t = await db.sequelize.transaction();

  try {
    // Check if user exists
    let userExists = await User.findOne({ where: { email } });
    if (userExists) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "User with that email already exists" });
    }

    // Create user
    const user = await User.create({ name, email, password }, { transaction: t });

    // Assign roles and create profile
    if (roles && roles.length > 0) {
      const roleInstances = await db.Role.findAll({
        where: {
          name: {
            [Op.in]: roles,
          },
        },
      });

      if (roleInstances.length !== roles.length) {
        await t.rollback();
        return res
          .status(400)
          .json({ message: "One or more roles are invalid" });
      }

      await user.addRoles(roleInstances, { transaction: t });

      // Create profile based on role
      if (roles.includes("student")) {
        if (!rollNumber) {
          await t.rollback();
          return res
            .status(400)
            .json({ message: "Roll number is required for students" });
        }
        // Check if roll number is unique
        const studentExists = await db.StudentProfile.findOne({
          where: { rollNumber },
        });
        if (studentExists) {
          await t.rollback();
          return res
            .status(400)
            .json({ message: "Student with that roll number already exists" });
        }
        await db.StudentProfile.create(
          { userId: user.id, rollNumber },
          { transaction: t }
        );
      }

      if (
        roles.includes("faculty") ||
        roles.includes("hod") ||
        roles.includes("principal")
      ) {
        if (!department) {
          await t.rollback();
          return res
            .status(400)
            .json({ message: "Department is required for staff" });
        }
        await db.FacultyProfile.create(
          { userId: user.id, department },
          { transaction: t }
        );
      }
    }

    await t.commit();

    // Refetch user with roles to send back in response
    const newUser = await User.findByPk(user.id, {
      include: [
        {
          model: db.Role,
          as: "roles",
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
      attributes: { exclude: ["password"] },
    });

    res.status(201).json(newUser);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  const { name, email, password, roles, rollNumber, department } = req.body;
  const userId = req.params.id;

  const t = await db.sequelize.transaction();

  try {
    const user = await User.findByPk(userId, {
      include: [
        { model: db.Role, as: "roles" },
        { model: db.StudentProfile, as: "studentProfile" },
        { model: db.FacultyProfile, as: "facultyProfile" },
      ],
    });

    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    // Update basic user details
    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      user.password = password; // Hook will hash it
    }
    await user.save({ transaction: t });

    // Update roles
    if (roles && roles.length > 0) {
      const roleInstances = await db.Role.findAll({
        where: { name: { [Op.in]: roles } },
      });
      if (roleInstances.length !== roles.length) {
        await t.rollback();
        return res
          .status(400)
          .json({ message: "One or more roles are invalid" });
      }
      await user.setRoles(roleInstances, { transaction: t });
    }

    // Get the updated roles to decide which profile to update
    const updatedRoles = roles || user.roles.map((r) => r.name);

    // Update profiles
    if (updatedRoles.includes("student")) {
      if (rollNumber) {
        const studentProfile =
          user.studentProfile ||
          (await db.StudentProfile.findOne({ where: { userId } }));
        if (studentProfile) {
          // Check for roll number uniqueness if it's being changed
          if (rollNumber !== studentProfile.rollNumber) {
            const existingProfile = await db.StudentProfile.findOne({
              where: { rollNumber },
            });
            if (existingProfile) {
              await t.rollback();
              return res.status(400).json({
                message: "Another student with this roll number already exists.",
              });
            }
          }
          studentProfile.rollNumber = rollNumber;
          await studentProfile.save({ transaction: t });
        } else {
          // If user is being made a student and doesn't have a profile yet
          await db.StudentProfile.create(
            { userId, rollNumber },
            { transaction: t }
          );
        }
      }
    }

    if (updatedRoles.some((r) => ["faculty", "hod", "principal"].includes(r))) {
      if (department) {
        const facultyProfile =
          user.facultyProfile ||
          (await db.FacultyProfile.findOne({ where: { userId } }));
        if (facultyProfile) {
          facultyProfile.department = department;
          await facultyProfile.save({ transaction: t });
        } else {
          // If user is being made a faculty member and doesn't have a profile yet
          await db.FacultyProfile.create(
            { userId, department },
            { transaction: t }
          );
        }
      }
    }

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
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.destroy();
    res.json({ message: "User removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
