import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import Ticket from "./models/ticketModel.js";



// routes
import userRoute from "./routes/userRoute.js";
import ticketRoute from "./routes/ticketRoute.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);//create http server using express application
const connectedSockets = new Set(); //store unique values i mean socket in unique 

//Initialize socket.io with server with cors configuration
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

//connection event trigger when new client connect to socket.io
io.on("connection", (socket) => {
 //add socket to a set(connectedsockets) for keep track unique connected sockets
  connectedSockets.add(socket);
  function emitToAllConnectedDevices(event, data) {
   //this fn broadcast event and data to all connected sockets. iterate to the set i mean connectedsockets and emit it.
    connectedSockets.forEach((socket) => {
      socket.emit(event, data);
    });
  }
  console.log(`User Connected: ${socket.id}`);


//Payload nothing but object,chat event handler
//updating of messages among connected clients when a new chat event occurs
  socket.on("chat", (payload) => {
    console.log(payload, "chat");
    //In ticket collection specified id matching the ticketId received in payload
    Ticket.find({ _id: payload.ticketId }).then((data) => {
      console.log(`Ticket: ${data}`);
      emitToAllConnectedDevices("newMessage", data[0].messages);
    });
  });

//update a document in ticket collection
  socket.on("sendChat", (payload) => {
    Ticket.updateOne(
      { _id: payload.ticketId },
      {
        $push: {
          messages: { sender: payload.sender, content: payload.content },
        },
      }
    ).then((data) => {
      //After update msg below code fetch updated ticket details to ensure updated information or not
      Ticket.find({ _id: payload.ticketId }).then((updatedTicket) => {
        emitToAllConnectedDevices("updatedMessage", updatedTicket[0].messages);
      });
    });
  });

  //disconnect event triggered client disconnect from socket.io server
  //delete method used for disconnect socket
  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
    connectedSockets.delete(socket);
  });
});

app.use("/api/users", userRoute);
app.use("/api/tickets", ticketRoute);

app.use(notFound);
app.use(errorHandler);






const PORT = process.env.PORT || 3001;
server.listen(PORT,'0.0.0.0', () => console.log("listening on port", PORT));
//node server.js