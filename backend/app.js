import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from "./Routes/userRoute.js";
import noteRouter from "./Routes/notesRoute.js";
import { globalErrorHandler } from './Middlewares/globalErrorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/note", noteRouter);

app.use(globalErrorHandler);

export default app;