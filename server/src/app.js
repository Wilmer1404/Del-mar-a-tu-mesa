const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,          // ej: https://del-mar-a-tu-mesa.netlify.app
  'http://localhost:5173',          // dev local
  'http://localhost:4173',          // preview local
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Permitir peticiones sin origin (Postman, curl, mismo servidor)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origen ${origin} no permitido.`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: `Ruta ${req.originalUrl} no encontrada.` });
});

app.use(errorHandler);

module.exports = app;
