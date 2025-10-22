import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import userRouter from "./Routes/userRoute.js"
import noteRouter from "./Routes/notesRoute.js";
import { globalErrorHandler } from './Middlewares/globalErrorHandler.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

//Todo: Add allowedorigins after making frontend
/*const allowedorigins = [];
  app.use(cors({
    origin: allowedorigins,
    credentials: true
  }));
*/

app.use("/api/user", userRouter);
app.use("/api/note", noteRouter);

app.use(globalErrorHandler);

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`Server is running at http://localhost:${PORT}`);
  }
});