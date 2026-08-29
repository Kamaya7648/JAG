const { events } = require("../data/events");

let eventCounter = 3000;

const getEvents = (req, res) => {
  res.json(events);
};

const addEvent = (req, res) => {
  const { date, startHour, duration, text } = req.body;

  if (!date || !text) {
    return res.status(400).json({
      message: "date and text are required"
    });
  }

  const newEvent = {
    id: `event-${eventCounter++}`,
    date,
    startHour: startHour || 8,
    duration: duration || 1,
    text
  };

  events.push(newEvent);

  res.status(201).json({
    message: "Event added successfully",
    event: newEvent
  });
};

const updateEvent = (req, res) => {
  const event = events.find((e) => e.id === req.params.id);

  if (!event) {
    return res.status(404).json({
      message: "Event not found"
    });
  }

  const { date, startHour, duration, text } = req.body;

  if (date !== undefined) event.date = date;
  if (startHour !== undefined) event.startHour = startHour;
  if (duration !== undefined) event.duration = duration;
  if (text !== undefined) event.text = text;

  res.json({
    message: "Event updated successfully",
    event
  });
};

const deleteEvent = (req, res) => {
  const index = events.findIndex((e) => e.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      message: "Event not found"
    });
  }

  const deletedEvent = events.splice(index, 1);

  res.json({
    message: "Event deleted successfully",
    event: deletedEvent[0]
  });
};

module.exports = {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent
};