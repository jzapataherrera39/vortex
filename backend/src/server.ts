import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import piscinaRoutes from './routes/piscinaRoutes';
import swaggerUiSetup from 'swagger-ui-express';
import swaggerSpec from './config/swagger';

dotenv.config();
connectDB();

const app = express();


app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/piscina", piscinaRoutes);



app.use("/api/docs", swaggerUiSetup.serve, swaggerUiSetup.setup(swaggerSpec));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
