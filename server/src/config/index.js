require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const required = (key, fallback) => {
  const val = process.env[key] || fallback;
  if (!val && !fallback) {
    throw new Error(`[CONFIG] ${key} no está definido en las variables de entorno`);
  }
  return val;
};

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001'),
  db: {
    host: required('DB_HOST', 'localhost'),
    port: parseInt(required('DB_PORT', '5432')),
    database: required('DB_NAME'),
    user: required('DB_USER', 'postgres'),
    password: required('DB_PASSWORD'),
  },
  jwt: {
    secret: required('JWT_SECRET'),
    expiresIn: required('JWT_EXPIRES_IN', '7d'),
  },
};
