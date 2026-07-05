const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
  console.log(`[Server] API corriendo en http://localhost:${config.port}`);
  console.log(`[Server] Health check: http://localhost:${config.port}/api/health`);
});
