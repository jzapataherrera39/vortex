import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import piscinaRoutes from './routes/piscinaRoutes';
import userRoutes from './routes/userRoutes';
import swaggerUiSetup from 'swagger-ui-express';
import swaggerSpec from './config/swagger';

dotenv.config();
connectDB();

const app = express();


app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: 'http://localhost:3000', 
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));

// Health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use("/api/auth", authRoutes);
app.use("/api/piscinas", piscinaRoutes);
app.use("/api/users", userRoutes);

app.use("/api-docs", swaggerUiSetup.serve, swaggerUiSetup.setup(swaggerSpec));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
