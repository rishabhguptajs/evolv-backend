import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';

const app: Application = express();

dotenv.config();

connectDB();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Evolv API is running...');
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});