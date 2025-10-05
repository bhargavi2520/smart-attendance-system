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

    const userRoles = req.user.roles;
    const cleanedAllowedRoles = allowedRoles.map((role) => role.trim());

    const hasPermission = userRoles.some((role) =>
      cleanedAllowedRoles.includes(role.trim())
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
