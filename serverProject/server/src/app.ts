import cors from 'cors';
import express from 'express';
import { logRequestToFile } from './Middlewares/loggerMid';
import { errorHandler } from './Middlewares/errorHendling';
import { studentRouter } from './Routers/Student/studentRouter';
import { teacherRouter } from './Routers/Teacher/teacherRouter';
import { indetificationRouter } from './Routers/Identification/identificationRouter';
import { myDB } from './Utils/ConnectDB';

export const app = express();


myDB.getDB();
app.use(cors());
app.use(express.json()); 
app.use((req, res, next) => {
  console.log(`קיבלתי בקשה: ${req.method} לכתובת ${req.url}`);
  next();
});

app.use(logRequestToFile); 
app.use('/auth', indetificationRouter);
app.use('/student', studentRouter);
app.use('/teacher', teacherRouter);
app.use(errorHandler);