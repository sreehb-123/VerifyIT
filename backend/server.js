import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';

dotenv.config();

const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Mongo DB Connected');
    } catch (error) {
        console.error('Error connecting to db: ', error.message);
        process.exit(1);
    }
};

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

ConnectDB();

app.use('/api/auth', authRoutes);
app.use('/api/leaves', leaveRoutes);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on ${PORT}`);
});