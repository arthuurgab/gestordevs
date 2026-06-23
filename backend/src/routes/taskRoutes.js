const { Router } = require("express");
const TaskController = require("../controllers/TaskController");

const router = Router();

router.post("/", TaskController.create);
router.get("/", TaskController.listAll);
router.get("/:id", TaskController.getById);
router.put("/:id", TaskController.update);
router.patch("/:id/status", TaskController.updateStatus);
router.delete("/:id", TaskController.delete);

module.exports = router;
