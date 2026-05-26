import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import companiesRoutes from './routes/companies.js';
import tripsRoutes from './routes/trips.js';
import statsRoutes from './routes/stats.js';
import specialOffersRoutes from './routes/specialOffers.js';
import jobOffersRoutes from './routes/jobOffers.js';

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/special-offers', specialOffersRoutes);
app.use('/api/job-offers', jobOffersRoutes);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server Error:', err);
  const message = err instanceof Error ? err.message : 'Erreur serveur';
  res.status(500).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`FasoBus API: http://localhost:${PORT}`);
  console.log(`CORS autorisé pour: ${FRONTEND_URL}`);
});
