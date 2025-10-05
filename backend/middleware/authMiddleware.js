const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Decoded token has id and roles
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ message: "Forbidden: No roles found" });
    }

    // Convert the roles required by the route to uppercase
    const upperCaseAllowedRoles = allowedRoles.map((role) =>
      role.toUpperCase()
    );

    // Check if the user has permission, ignoring case by converting their roles to uppercase too
    const hasPermission = req.user.roles.some((role) =>
      upperCaseAllowedRoles.includes(role.trim().toUpperCase())
    );

    if (!hasPermission) {
      return res.status(403).json({
        message: `Forbidden: You need one of the following roles: ${allowedRoles.join(
          ", "
        )}`,
      });
    }

    next();
  };
};
module.exports = { protect, authorize };
