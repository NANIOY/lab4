// require express
const express = require("express");
// create a new router
const router = express.Router();

// import controller
const messagesController = require("../../../controllers/api/v1/messages");

// GET all messages
router.get("/", messagesController.index);
// POST new message
router.post("/", messagesController.create);
// GET message by id
router.get("/:id", messagesController.getMessageById);
// PUT update message by id
router.put("/:id", messagesController.updateMessage);
// DELETE message by id
router.delete("/:id", messagesController.deleteMessage);

module.exports = router;