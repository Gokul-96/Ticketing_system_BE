import express from "express";
const router = express.Router();

import {
  createTicket,
  getAllTickets,
  getUserTickets,
  getTicket,
  updateTicketMessage,
  updateTicketStatus,
  updateTicketAssign,
} from "../controllers/ticketController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

router.route("/").post(protect, createTicket);
router.route("/getTicket/:id").get(protect, getTicket);
router.route("/:id/messages").post(protect, updateTicketMessage);
router.route("/:id/status").put(protect, updateTicketStatus);
router.route("/:id/assign").put(protect, updateTicketAssign);
router.route("/getAllTickets").get(protect, admin, getAllTickets);
router.route("/getUserTickets").get(protect, getUserTickets);

export default router;