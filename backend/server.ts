import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import utilisateurRoutes from './routes/utilisateurRoutes.js';

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/utilisateurs', utilisateurRoutes);

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'API Réservations de Salles',
  });
});

app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    message: 'Route non trouvée',
    path: req.originalUrl,
  });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  const status = (err as Error & { status?: number }).status ?? 500;
  res.status(status).json({
    message: err.message ?? 'Une erreur interne est survenue',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV ?? 'development'}`);
  console.log(`URL: http://localhost:${PORT}`);
});
