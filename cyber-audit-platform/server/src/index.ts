import express, { Request, Response } from 'express';
import cors from 'cors';
import apiRoutes from './routes/routes';
import authRoutes from './routes/auth.routes';
import settingsRoutes from './routes/settings.routes';
import nmapRoutes from './routes/nmap.routes';
import { PORT } from './config/env';

const app = express();

app.use(cors());
app.use(express.json());

// Correct order of routes
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is running and healthy!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/nmap', nmapRoutes);
app.use('/api', apiRoutes); // General API routes last

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
