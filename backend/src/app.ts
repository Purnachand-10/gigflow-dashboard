import express from 'express';
import cors from 'cors';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import authRoutes from './routes/authRoutes';
import leadRoutes from './routes/leadRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
