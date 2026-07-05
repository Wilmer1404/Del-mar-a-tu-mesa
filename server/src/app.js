const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
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
