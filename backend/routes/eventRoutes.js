const express = require("express");
const {
  getEvents,
  createEvent,
  deleteEvent,
} = require("../controllers/eventController");

const router = express.Router();

router.get("/", getEvents);
router.post("/", createEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
