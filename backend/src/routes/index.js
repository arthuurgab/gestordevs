const { Router } = require("express");
const userRoutes = require("./userRoutes");
const taskRoutes = require("./taskRoutes");

const router = Router();

router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);

module.exports = router;
