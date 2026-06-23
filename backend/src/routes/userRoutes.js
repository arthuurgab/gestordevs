const { Router } = require("express");
const UserController = require("../controllers/UserController");

const router = Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/", UserController.listAll);
router.get("/:id", UserController.getById);
router.put("/:id", UserController.update);
router.delete("/:id", UserController.delete);

module.exports = router;
