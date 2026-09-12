const Event = require('../../database/models/Event');

async function getEvents(req, res) {
  try {
    const events = await Event.find({
      owner: req.user.id,
    }).sort({ date: 1, startHour: 1 });

    return res.status(200).json(events);
  } catch (err) {
    console.error("Get events error:", err);

    return res.status(500).json({
      message: "Failed to fetch events.",
    });
  }
}

async function createEvent(req, res) {
  try {
    const { date, startHour, duration, text, status } = req.body;

    if (!date || startHour === undefined || !duration || !text) {
      return res.status(400).json({
        message: "date, startHour, duration, and text are required.",
      });
    }

    const event = await Event.create({
      owner: req.user.id,
      date,
      startHour,
      duration,
      text,
      status: status || "Meeting",
    });

    return res.status(201).json({ event });
  } catch (err) {
    console.error("Create event error:", err);

    return res.status(500).json({
      message: "Failed to add event.",
    });
  }
}

async function deleteEvent(req, res) {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    return res.status(200).json({
      message: "Event deleted",
    });
  } catch (err) {
    console.error("Delete event error:", err);

    return res.status(500).json({
      message: "Failed to delete event.",
    });
  }
}

module.exports = {
  getEvents,
  createEvent,
  deleteEvent,
};