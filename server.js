import express from 'express';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import connectDB from './config/db.js';
import colors from 'colors';
import dotenv from 'dotenv';

dotenv.config();

connectDB()

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setting up routes
app.use('/api/v1/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on port: http://localhost:${port}`);
});