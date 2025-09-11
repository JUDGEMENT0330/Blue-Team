import express, { Request, Response } from 'express';
import cors from 'cors';
import apiRoutes from './api/routes';

const app = express();
// Configure CORS for security
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:4173').split(',');
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(apiRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is running and healthy!' });
});

export default app;
