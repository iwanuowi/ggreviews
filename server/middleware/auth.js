const jwt = require("jsonwebtoken");
// const { getUserByEmail } = require("../controllers/user");
const User = require("../models/User");

const isValidUser = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authorization.replace("Bearer ", "").trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find by ID instead of email
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ error: "Invalid user" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authorization.replace("Bearer ", "").trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden",
        message: "You are not authorized to perform this action",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = { isValidUser, isAdmin };
