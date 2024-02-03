import express from "express";

import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import cors from "cors";
import Ticket from "./models/ticketModel.js";

// routes
import userRoute from "./routes/userRoute.js";
import ticketRoute from "./routes/ticketRoute.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/tickets", ticketRoute);

app.use(notFound);
app.use(errorHandler);

export default app;