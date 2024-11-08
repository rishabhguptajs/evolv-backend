import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import morgan from 'morgan';

const app: Application = express();

dotenv.config();

connectDB();

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req: Request, res: Response) => {
    res.send('Evolv API is running...');
});

app.use('/api/auth', authRoutes);

const port = process.env.PORT || 8080 || 5000 || 5173 || 10000 || 3100;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});