import mongoose from "mongoose";

const ticketSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      maxlength: 50,
    },
    description: {
      type: String,
      required: true,
      maxlength: 200,
    },
    category: {
      type: String,
      required: true,
    },
    selectLanguage: {
      type: String,
      required: true,
    },
    availableFrom: {
      type: String,
      required: true,
    },
    availableTo: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Open",
    },
    messages: [
      {
        sender: {
          type: String,
        },
        content: {
          type: String,
        },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    assign: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;