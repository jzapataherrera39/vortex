import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
// importa también tus otras rutas…

dotenv.config();
connectDB();

const app = express();

// *** ESTO ES LO MÁS IMPORTANTE ***
app.use(express.json()); // <--- SIN ESTO req.body = {}
app.use(express.urlencoded({ extended: true })); // PARA FORM-DATA

app.use(cors());

// RUTAS
app.use("/api/auth", authRoutes);
// app.use("/api/pools", poolRoutes);
// etc...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
