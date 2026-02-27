import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import utilisateurRoutes from './routes/utilisateurRoutes.js';
import salleRoutes from './routes/salleRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import notationRoutes from './routes/notationRoutes.js';
import commentaireRoutes from './routes/commentaireRoutes.js';
import { specs, swaggerUi } from './config/swagger.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/salles', salleRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/notations', notationRoutes);
app.use('/api/commentaires', commentaireRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Party Hoster - Documentation'
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, filePath) => {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.removeHeader('Cross-Origin-Opener-Policy');
      res.removeHeader('Cross-Origin-Embedder-Policy');
      res.removeHeader('Cross-Origin-Resource-Policy');
      const ext = path.extname(filePath);
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext.toLowerCase())) {
        res.setHeader('Content-Type', `image/${ext.slice(1)}`);
      }
    }
}));

app.get('/health', (_req: Request, res: Response) => {
    res.json({ 
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'API Réservations de Salles'
    });
});

app.use('*', (req: Request, res: Response) => {
    res.status(404).json({ 
        message: 'Route non trouvée',
        path: req.originalUrl 
    });
});

interface Err extends Error {
    status?: number;
}

app.use((err: Err, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Une erreur interne est survenue',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Documentation API: http://localhost:${PORT}/api-docs`);
});
