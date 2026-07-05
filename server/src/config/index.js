require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

module.exports = {
  port: parseInt(process.env.PORT || '3001'),
  db: {
    host:     process.env.DB_HOST || 'localhost',
    port:     parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'delmar_a_tumesa',
    user:     process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },
  jwt: {
    secret:     process.env.JWT_SECRET || 'dev-secret-change-in-production',
    expiresIn:  process.env.JWT_EXPIRES_IN || '7d',
  },
};
