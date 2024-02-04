import asyncHandler from "express-async-handler";
import Ticket from "../models/ticketModel.js";

// @desc    Create a Ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    selectLanguage,
    availableFrom,
    availableTo,
  } = req.body;
  const ticket = new Ticket({
    user: req.user._id,
    title,
    description,
    category,
    selectLanguage,
    availableFrom,
    availableTo,
    messages: [],
  });

  const createdTicket = await ticket.save();
  res.status(201).json(createdTicket);
});

// @desc    Get all Tickets
// @route   GET /api/tickets/getAllTickets
// @access  Admin
const getAllTickets = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number, defaults to 1
  const perPage = 10; // Number of items per page
  const skip = (page - 1) * perPage; // Number of items to skip

  const tickets = await Ticket.find().skip(skip).limit(perPage).exec();

  // Count total number of tickets
  const totalTickets = await Ticket.countDocuments().exec();

  res.json({
    tickets,
    currentPage: page,
    totalPages: Math.ceil(totalTickets / perPage),
  });
});

// @desc    Get all Tickets
// @route   GET /api/tickets/getUserTickets
// @access  Private
const getUserTickets = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number, defaults to 1
  const perPage = 10; // Number of items per page
  const skip = (page - 1) * perPage; // Number of items to skip

  const tickets = await Ticket.find({ user: req.user._id })
    .skip(skip)
    .limit(perPage)
    .exec();

  // Count total number of tickets
  const totalTickets = await Ticket.find({ user: req.user._id })
    .countDocuments()
    .exec();

  res.json({
    tickets,
    currentPage: page,
    totalPages: Math.ceil(totalTickets / perPage),
  });
});

// @desc    GetTicket
// @route   GET /api/tickets/getTicket
// @access  Private
const getTicket = asyncHandler(async (req, res) => {
  const ticketId = req.params.id;
  const ticket = await Ticket.find({ _id: ticketId });
  res.json(ticket);
});

// @desc    updateTicketMessage
// @route   POST /api/tickets/:id/messages
// @access  Private
const updateTicketMessage = asyncHandler(async (req, res) => {
  const ticketId = req.params.id;
  const { sender, content } = req.body;

  // Update the ticket document with the new message
  const ticket = await Ticket.updateOne(
    { _id: ticketId },
    { $push: { messages: { sender, content } } }
  );

  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  const updatedTicket = await Ticket.find({ _id: ticketId });

  res.status(201).json(updatedTicket);
});

// @desc    updateTicketStatus
// @route   PUT /api/tickets/:id/status
// @access  Private
const updateTicketStatus = asyncHandler(async (req, res) => {
  const ticketId = req.params.id;
  const { status } = req.body;

  // Update the ticket document with the new message
  const ticket = await Ticket.updateOne(
    { _id: ticketId },
    { $set: { status } }
  );

  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  const updatedTicket = await Ticket.find({ _id: ticketId });

  res.status(201).json(updatedTicket);
});

// @desc    updateTicketAssign
// @route   PUT /api/tickets/:id/assign
// @access  Private
const updateTicketAssign = asyncHandler(async (req, res) => {
  const ticketId = req.params.id;
  const { assign } = req.body;

  // Update the ticket document with the new message
  const ticket = await Ticket.updateOne(
    { _id: ticketId },
    { $set: { assign } }
  );

  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  const updatedTicket = await Ticket.find({ _id: ticketId });

  res.status(201).json(updatedTicket);
});

export {
  createTicket,
  getAllTickets,
  getUserTickets,
  getTicket,
  updateTicketMessage,
  updateTicketStatus,
  updateTicketAssign,
};