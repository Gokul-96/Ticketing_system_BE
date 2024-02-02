const config = require('./utils/config');
const mongoose = require ('mongoose');
const app = require('./app');
import { Server } from "socket.io";

const connectedSockets = new Set();

export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  connectedSockets.add(socket);
  function emitToAllConnectedDevices(event, data) {
    connectedSockets.forEach((socket) => {
      socket.emit(event, data);
    });
  }
  console.log(`User Connected: ${socket.id}`);

  socket.on("chat", (payload) => {
    console.log(payload, "chat");
    Ticket.find({ _id: payload.ticketId }).then((data) => {
      console.log(`Ticket: ${data}`);
      emitToAllConnectedDevices("newMessage", data[0].messages);
    });
  });

  socket.on("sendChat", (payload) => {
    Ticket.updateOne(
      { _id: payload.ticketId },
      {
        $push: {
          messages: { sender: payload.sender, content: payload.content },
        },
      }
    ).then((data) => {
      Ticket.find({ _id: payload.ticketId }).then((updatedTicket) => {
        emitToAllConnectedDevices("updatedMessage", updatedTicket[0].messages);
      });
    });
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
    connectedSockets.delete(socket);
  });
});







console.log('connecting to MongoDB');
mongoose.connect(config.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(config.PORT,()=>{
        console.log(`server is running on port ${config.PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });