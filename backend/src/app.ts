import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

const app: Application = express();

// Body Parser Middleware
app.use(express.json());

// Cors Middleware
const corsOptions = {
  origin: 'http://localhost:3000', 
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

// Import rutas
import authRoutes from './routes/authRoutes';
import piscinaRoutes from './routes/piscinaRoutes';
import userRoutes from './routes/userRoutes';

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/piscinas', piscinaRoutes);
app.use('/api/users', userRoutes);



export default app;
